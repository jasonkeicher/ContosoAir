const mongoose = require('mongoose');
const BookFlightsRepository = require('./book.repository');

describe('[Unit] BookFlightsRepository', () => {
  let bookRepository;

  beforeAll(() => {
    // Set up a test database connection
    const options = {
      cosmosdb_name: 'testdb',
      cosmosdb_key: 'testkey',
      cosmosdb_url: 'testurl',
      database_name: 'testdb',
    };
    bookRepository = new BookFlightsRepository(options);
  });

  afterAll(async () => {
    // Close the test database connection
    await mongoose.connection.close();
  });

  describe('getUserInfo', () => {
    it('should return user info if user exists', async () => {
      // Create a mock UserInfoModel
      const UserInfoModel = mongoose.model('UserInfoModel', {});
      const mockUserInfo = { user: 'testuser', booked: null, purchased: [] };
      jest.spyOn(UserInfoModel, 'findOne').mockResolvedValue(mockUserInfo);

      // Set the mock model for testing
      mongoose.model('UserInfoModel', UserInfoModel);

      // Call the method under test
      const result = await bookRepository.getUserInfo('testuser');

      // Assert the result
      expect(result).toEqual(mockUserInfo);
    });

    it('should return default user info if user does not exist', async () => {
      // Create a mock UserInfoModel
      const UserInfoModel = mongoose.model('UserInfoModel', {});
      jest.spyOn(UserInfoModel, 'findOne').mockResolvedValue(null);

      // Set the mock model for testing
      mongoose.model('UserInfoModel', UserInfoModel);

      // Call the method under test
      const result = await bookRepository.getUserInfo('nonexistentuser');

      // Assert the result
      expect(result).toEqual({ user: 'nonexistentuser', booked: null, purchased: [] });
    });
  });

  describe('createOrUpdateUserInfo', () => {
    it('should create or update user info', async () => {
      // Create a mock UserInfoModel
      const UserInfoModel = mongoose.model('UserInfoModel', {});
      jest.spyOn(UserInfoModel, 'findOneAndUpdate').mockResolvedValue(null);

      // Set the mock model for testing
      mongoose.model('UserInfoModel', UserInfoModel);

      // Call the method under test
      const userInfo = { user: 'testuser', booked: null, purchased: [] };
      await bookRepository.createOrUpdateUserInfo(userInfo);

      // Assert that the findOneAndUpdate method was called with the correct arguments
      expect(UserInfoModel.findOneAndUpdate).toHaveBeenCalledWith({ user: 'testuser' }, userInfo, { upsert: true });
    });
  });
});