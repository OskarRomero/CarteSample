using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain.Friends;
using Sabio.Models.Requests.Friends;
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
    public class FriendService : IFriendService
    {
        IDataProvider _data = null;
        public FriendService(IDataProvider data)// constructor creates instance of above class FriendService
        {
            _data = data;

        }
        
        public Friend Get(int id)//GET BY ID
        {
            string procname = "[dbo].[Friends_SelectById]";
            Friend friend = null;//
            _data.ExecuteCmd(procname, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);
            }, delegate (IDataReader reader, short set)
            {//reader from DB returns a new User
                int startingIndex = 0;
                friend = MapSingleFriend(reader, ref startingIndex);
            }
            );
            return friend;
        }

        public FriendV2 GetV2(int id)//FriendV2 GetById
        {
            string procname = "[dbo].[Friends_SelectByIdV2]";
            FriendV2 friend = null;//
            _data.ExecuteCmd(procname, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);
            }, delegate (IDataReader reader, short set)
            {//reader from DB returns a new User
                int startingIndex = 0;
                friend = MapSingleFriendV2(reader, ref startingIndex);
            }
            );
            return friend;
        }

        public FriendV3 GetV3(int id)//FriendV3 GetById
        {
            string procname = "[dbo].[Friends_SelectByIdV3]";
            FriendV3 friend = null;
            _data.ExecuteCmd(procname, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);
            }, delegate (IDataReader reader, short set)
            {//reader from DB returns a new User
                int startingIndex = 0;
                friend = MapSingleFriendV3(reader, ref startingIndex);
            }
            );
            return friend;
        }
        public Paged<FriendV2> PaginationV2 (int pageIndex, int pageSize)
        {
            Paged<FriendV2> friendList = null;
            List<FriendV2> list = null;
            int totalCount = 0;

            _data.ExecuteCmd("[dbo].[Friends_PaginationV2]",
                (param) =>
                {
                    param.AddWithValue("@PageIndex", pageIndex);
                    param.AddWithValue("@PageSize", pageSize);
                },
                (reader, recordSetIndex) =>
                {
                    FriendV2 friendV2 = MapFriendV2Paginate(reader);
                    totalCount = reader.GetSafeInt32(6);

                    if (list == null)
                    {
                        list = new List<FriendV2>();
                    }
                    list.Add(friendV2);
                });
            if (list != null)
            {
                friendList = new Paged<FriendV2>(list, pageIndex, pageSize, totalCount);
            }
            return friendList;
        }

        public Paged<FriendV3> PaginationV3(int pageIndex, int pageSize)
        {
            Paged<FriendV3> friendList = null;
            List<FriendV3> list = null;
            int totalCount = 0;

            _data.ExecuteCmd("[dbo].[Friends_PaginationV3]",
                (param) =>
                {
                    param.AddWithValue("@PageIndex", pageIndex);
                    param.AddWithValue("@PageSize", pageSize);
                },
                (reader, recordSetIndex) =>
                {
                    FriendV3 friendV3 = MapFriendV3Paginate(reader);
                    totalCount = reader.GetSafeInt32(6);

                    if (list == null)
                    {
                        list = new List<FriendV3>();
                    }
                    list.Add(friendV3);
                });
            if (list != null)
            {
                friendList = new Paged<FriendV3>(list, pageIndex, pageSize, totalCount);
            }
            return friendList;
        }



        public Paged<FriendV2> SearchPaginationV2(int pageIndex, int pageSize, string query)
        {
            Paged<FriendV2> friendList = null;
            List<FriendV2> list = null;
            int totalCount = 0;

            _data.ExecuteCmd("[dbo].[Friends_Search_PaginationV2]",
                (param) =>
                {
                    param.AddWithValue("@PageIndex", pageIndex);
                    param.AddWithValue("@PageSize", pageSize);
                    param.AddWithValue("@Query", query);
                },
                (reader, recordSetIndex) =>
                {
                    FriendV2 friendV2 = MapFriendV2Paginate(reader);
                    totalCount = reader.GetSafeInt32(6);

                    if (list == null)
                    {
                        list = new List<FriendV2>();
                    }
                    list.Add(friendV2);
                });
            if (list != null)
            {
                friendList = new Paged<FriendV2>(list, pageIndex, pageSize, totalCount);
            }
            return friendList;
        }

        public Paged<FriendV3> SearchPaginationV3(int pageIndex, int pageSize, string query)
        {
            Paged<FriendV3> friendList = null;
            List<FriendV3> list = null;
            int totalCount = 0;

            _data.ExecuteCmd("[dbo].[Friends_Search_PaginationV3]",
                (param) =>
                {
                    param.AddWithValue("@PageIndex", pageIndex);
                    param.AddWithValue("@PageSize", pageSize);
                    param.AddWithValue("@Query", query);
                },
                (reader, recordSetIndex) =>
                {
                    FriendV3 friendV3 = MapFriendV3Paginate(reader);
                    totalCount = reader.GetSafeInt32(6);

                    if (list == null)
                    {
                        list = new List<FriendV3>();
                    }
                    list.Add(friendV3);
                });
            if (list != null)
            {
                friendList = new Paged<FriendV3>(list, pageIndex, pageSize, totalCount);
            }
            return friendList;
        }


        //GETALL
        public List<Friend> GetAll()
        {
            List<Friend> list = null;
            string procname = "[dbo].[Friends_SelectAll]";
            _data.ExecuteCmd(procname, inputParamMapper: null
                , singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;
                    Friend aFriend = MapSingleFriend(reader, ref startingIndex);

                    if (list == null)
                    {
                        list = new List<Friend>();
                    }
                    list.Add(aFriend);
                }

            );
            return list;
        }

        //ADD
        public int Add(FriendAddRequest model, int userId)
        {
            int id = 0;
            string procName = "[dbo].[Friends_Insert]";
            //delegate passes below func to ExecuteNonQuery to pass params needed by the proc to run execution
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParams(model, col);//calls func at the bottom of this doc to populate every column
                col.AddWithValue("@UserId", userId);
                //captures a Id of new record
                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;
                //this adds id to the collection just created above
                col.Add(idOut);
                //this returns the Id of the value we just added
            }, returnParameters: delegate (SqlParameterCollection returnCollection)
            {
                object oId = returnCollection["@Id"].Value;
                int.TryParse(oId.ToString(), out id);

            });

            return id;
        }

        //UPDATE
        public void Update(FriendUpdateRequest model, int userId)//<<==removed second param:
        {
            string procName = "[dbo].[Friends_Update]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {

                AddCommonParams(model, col);
                col.AddWithValue("@UserId", model.Id);
                col.AddWithValue("@Id", userId);

            }, returnParameters: null);
        }

        //DELETE
        public void Delete(int id)// no need for model since it's only one integer to be passed in
        {
            string procName = "[dbo].[Friends_Delete]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {

                col.AddWithValue("@Id", id);

            }, returnParameters: null//no need to return anything when using delete


            );
            //no return needed;
        }

        //PAGINATION (AFTER .NET Web API TASK)
        //SEARCH (AFTER .NET Web API TASK)
        private static Friend MapSingleFriend(IDataReader reader, ref int startingIndex)
        {
            Friend aFriend = new Friend();

            //startingIndex = 0;

            aFriend.Id = reader.GetSafeInt32(startingIndex++);
            aFriend.Title = reader.GetSafeString(startingIndex++);
            aFriend.Bio = reader.GetSafeString(startingIndex++);
            aFriend.Summary = reader.GetSafeString(startingIndex++);
            aFriend.Headline = reader.GetSafeString(startingIndex++);
            aFriend.Slug = reader.GetSafeString(startingIndex++);
            aFriend.StatusId = reader.GetSafeInt32(startingIndex++);
            aFriend.PrimaryImageUrl = reader.GetSafeString(startingIndex++);
            aFriend.DateCreated = reader.GetDateTime(startingIndex++);
            aFriend.DateModified = reader.GetDateTime(startingIndex++);
            aFriend.UserId = reader.GetSafeInt32(startingIndex++);
            return aFriend;
        }

        private static FriendV2 MapSingleFriendV2(IDataReader reader, ref int startingIndex)
        {
            FriendV2 aFriendV2 = new FriendV2();
            aFriendV2.PrimaryImage = new Image();

            aFriendV2.Id = reader.GetSafeInt32(startingIndex++);
            aFriendV2.Title = reader.GetSafeString(startingIndex++);
            aFriendV2.Bio = reader.GetSafeString(startingIndex++);
            aFriendV2.Summary = reader.GetSafeString(startingIndex++);
            aFriendV2.Headline = reader.GetSafeString(startingIndex++);
            aFriendV2.Slug = reader.GetSafeString(startingIndex++);
            aFriendV2.StatusId = reader.GetSafeInt32(startingIndex++);
            aFriendV2.PrimaryImage.Id = reader.GetSafeInt32(startingIndex++);
            aFriendV2.PrimaryImage.TypeId = reader.GetSafeInt32(startingIndex++);
            aFriendV2.PrimaryImage.Url = reader.GetSafeString(startingIndex++);//problem
            aFriendV2.UserId = reader.GetSafeInt32(startingIndex++);
            aFriendV2.DateCreated= reader.GetDateTime(startingIndex++);
            aFriendV2.DateModified = reader.GetDateTime(startingIndex++);
            return aFriendV2;

        }

        private static FriendV3 MapSingleFriendV3(IDataReader reader, ref int startingIndex)
        {
            FriendV3 aFriendV3 = new FriendV3();
            aFriendV3.PrimaryImage = new Image();
            
            aFriendV3.Id = reader.GetSafeInt32(startingIndex++);
            aFriendV3.Title = reader.GetSafeString(startingIndex++);
            aFriendV3.Bio = reader.GetSafeString(startingIndex++);
            aFriendV3.Summary = reader.GetSafeString(startingIndex++);
            aFriendV3.Headline = reader.GetSafeString(startingIndex++);
            aFriendV3.Slug = reader.GetSafeString(startingIndex++);
            aFriendV3.StatusId = reader.GetSafeInt32(startingIndex++);
            //3 from Image Table
            aFriendV3.PrimaryImage.Id = reader.GetSafeInt32(startingIndex++);
            aFriendV3.PrimaryImage.TypeId = reader.GetSafeInt32(startingIndex++);
            aFriendV3.PrimaryImage.Url = reader.GetSafeString(startingIndex++);
            //Skills :reach into skills prop, deserialize the string returned [{"Id":1,"Name":"Javascript"}]
            aFriendV3.Skills = reader.DeserializeObject<List<Skill>>(startingIndex++);
            aFriendV3.UserId = reader.GetSafeInt32(startingIndex++);
            aFriendV3.DateCreated = reader.GetDateTime(startingIndex++);
            aFriendV3.DateModified = reader.GetDateTime(startingIndex++);
            return aFriendV3;

        }

        private static void AddCommonParams(FriendAddRequest model, SqlParameterCollection col)
        {
            col.AddWithValue("@Title", model.Title);
            col.AddWithValue("@Bio", model.Bio);
            col.AddWithValue("@Summary", model.Summary);
            col.AddWithValue("@Headline", model.Headline);
            col.AddWithValue("@Slug", model.Slug);
            col.AddWithValue("@StatusId", model.StatusId);
            col.AddWithValue("PrimaryImageUrl", model.PrimaryImageUrl);
            // col.AddWithValue("@UserId", model.UserId);
        }

        private static FriendV2 MapFriendV2Paginate(IDataReader reader)
        {
            FriendV2 model = new FriendV2();
            model.PrimaryImage = new Image();
            
            int index = 0;
            model.Id = reader.GetSafeInt32(index++);
            model.Title = reader.GetSafeString(index++);
            model.Bio = reader.GetSafeString(index++);
            model.Summary = reader.GetSafeString(index++);
            model.Headline = reader.GetSafeString(index++);
            model.Slug = reader.GetSafeString(index++);
            model.StatusId = reader.GetSafeInt32(index++);
            model.PrimaryImage.Id = reader.GetSafeInt32(index++);
            model.PrimaryImage.TypeId = reader.GetSafeInt32(index++);
            model.PrimaryImage.Url = reader.GetSafeString(index++);
            model.UserId = reader.GetSafeInt32(index++);
            model.DateCreated = reader.GetSafeDateTime(index++);
            model.DateModified = reader.GetDateTime(index++);
           return model;
        }

        private static FriendV3 MapFriendV3Paginate(IDataReader reader)
        {
            FriendV3 model = new FriendV3();
            model.PrimaryImage = new Image();

            int index = 0;
            model.Id = reader.GetSafeInt32(index++);
            model.Title = reader.GetSafeString(index++);
            model.Bio = reader.GetSafeString(index++);
            model.Summary = reader.GetSafeString(index++);
            model.Headline = reader.GetSafeString(index++);
            model.Slug = reader.GetSafeString(index++);
            model.StatusId = reader.GetSafeInt32(index++);
            //
            model.PrimaryImage.Id = reader.GetSafeInt32(index++);
            model.PrimaryImage.TypeId = reader.GetSafeInt32(index++);
            model.PrimaryImage.Url = reader.GetSafeString(index++);
            //
            model.Skills = reader.DeserializeObject<List<Skill>>(index++);
            model.UserId = reader.GetSafeInt32(index++);
            model.DateCreated = reader.GetSafeDateTime(index++);
            model.DateModified = reader.GetDateTime(index++);
            return model;
        }
    }
}

           