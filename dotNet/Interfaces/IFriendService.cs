using Sabio.Models;
using Sabio.Models.Domain.Friends;
using Sabio.Models.Requests.Friends;
using System.Collections.Generic;

namespace Sabio.Services.Interfaces
{
    public interface IFriendService
    {
        int Add(FriendAddRequest model, int userId);
        void Delete(int id);
        Friend Get(int id);
        List<Friend> GetAll();
        void Update(FriendUpdateRequest model, int userId);
        //void Update(FriendUpdateRequest model, int userId);

        public FriendV2 GetV2(int id);
        public Paged<FriendV2> PaginationV2(int pageIndex, int pageSize);
        public Paged<FriendV2> SearchPaginationV2(int pageIndex, int pageSize, string query);

        public FriendV3 GetV3(int id);
        public Paged<FriendV3> PaginationV3(int pageIndex, int pageSize);
        public Paged<FriendV3> SearchPaginationV3(int pageIndex, int pageSize, string query);
    }
}