using Sabio.Models.Domain.Coworkers;
using Sabio.Models.Requests.Coworkers;

namespace Sabio.Services.Interfaces
{
    public interface ICoworkerService
    {
        Coworker GetCoworkerById(int id);

        public int AddCoworker(CoworkersAddRequest model, int userId);
    }
}