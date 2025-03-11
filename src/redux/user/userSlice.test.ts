import { User } from "../../data/data";
import reducer, { fetchUsers, setSelectedUser, UserState } from "../user/userSlice";

const TestUsers: User[] = [
  {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "test@test.org",
    "gender": "Male",
    "ip_address": "127.0.0.1",
  },
  {
    "id": 2,
    "first_name": "Jane",
    "last_name": "Doe",
    "email": "test-second@test.org",
    "gender": "Female",
    "ip_address": "0.0.0.0",
  },
];

describe("usersSlice", () => {
  it("should return the initial state", () => {
    expect(reducer(undefined, { type: undefined })).toEqual({
      userList: [],
      selectedUser: null,
    });
  });

  it("adds users to list when fetched", () => {
    const action = { type: fetchUsers.fulfilled.type, payload: TestUsers };

    const previousState: UserState = {
      userList: [],
      selectedUser: null
    };

    expect(reducer(previousState, action)).toEqual({
      userList: TestUsers,
      selectedUser: null,
    });
  });

  it("sets the selected user", () => {
    const user = { id: 1, first_name: "John", last_name: "Doe", email: "john@example.com", gender: "male", ip_address: "127.0.0.1" };

    const action = { type: setSelectedUser.type, payload: user };
    const previousState: UserState = { userList: [user], selectedUser: null };

    expect(reducer(previousState, action)).toEqual({
      userList: [user],
      selectedUser: user,
    });
  });

});
