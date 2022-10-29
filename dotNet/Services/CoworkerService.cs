using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models.Domain.Coworkers;
using Sabio.Models.Requests.Coworkers;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services
{
    public class CoworkerService : ICoworkerService
    {
        IDataProvider _data = null;
        public CoworkerService(IDataProvider data)
        {
            _data = data;
        }

        public Coworker GetCoworkerById(int id)
        {
            string procName = "[dbo].[coworkers_SelectById]";
            Coworker aCoworker = null;
            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);//param proc requests
            }, delegate (IDataReader reader, short set)//reader from DB returns a new coworker
            {
                int startingIndex = 0;
                aCoworker = MapSingleCoworker(reader, ref startingIndex);
            });
            return aCoworker;
        }

        public int AddCoworker(CoworkersAddRequest model, int userId)
        {
            int id = 0;
            string procName = "[dbo].[coworkers_insert]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParams(model, col);
                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;
                col.Add(idOut);
            }, returnParameters: delegate (SqlParameterCollection returnCollection)
            {
                object oId = returnCollection["@Id"], Value;
                int.TryParse(oId.ToString(), out id);
            });
            return id;
        }

        private static Coworker MapSingleCoworker(IDataReader reader, ref int startingIndex)
        {
            Coworker coworkerModel = new Coworker();
            coworkerModel.PrimaryImageCo = new CoworkerImage();//PrimaryImageCo is Coworker's (model) prop that is CoWorkerImage (model)

            coworkerModel.Id = reader.GetSafeInt32(startingIndex++);
            coworkerModel.Name = reader.GetSafeString(startingIndex++);
            coworkerModel.Height = reader.GetSafeInt32(startingIndex++);
            //reachinto PrimaryImageCo property and grab 3 props from CoworkerImage model 
            coworkerModel.PrimaryImageCo.Id = reader.GetSafeInt32(startingIndex++);
            coworkerModel.PrimaryImageCo.TypeId = reader.GetSafeInt32(startingIndex++);
            coworkerModel.PrimaryImageCo.Url = reader.GetSafeString(startingIndex++);
            //reach into Talents prop and deserialize. In SQL Talents column returns a subquery joining two tables: example: [{"Id":3,"Name":"FastTyper"}]
            coworkerModel.Talents = reader.DeserializeObject<List<Talent>>(startingIndex++);

            return coworkerModel;
        }

        private static void AddCommonParams(CoworkersAddRequest model, SqlParameterCollection col)
        {
            col.AddWithValue("@Name", model.Name);
            col.AddWithValue("@Height", model.Height);
            col.AddWithValue("@PrimaryImgId", model.PrimaryImgId);
        }

        
    }
}
