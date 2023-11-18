// contactUsController.test.js
const { addContactMessage } = require("../Controller/ContactUsController");
const ContactUs = require("../Models/contactUsSchema ");

describe("addContactMessage", () => {
  it("should add a new contact message for a user", async () => {
    const req = {
      body: {
        name: "issa",
        email: "issahaddadhaddad@gmail.com",
        message: "hhi jesti",
      },
      user: {
        _id: "2",
        role: "user",
      },
    };

    const res = {
      json: jest.fn(),
    };

    const newMessageSaveMock = jest.spyOn(ContactUs.prototype, "save");
    newMessageSaveMock.mockResolvedValue({
      name: "issadsw",
      email: "issahaddadhaddad@gmail.com",
      message: "hi تثسف",
      user: "65584f4d4a6ff886a9efc38b",
      senderType: "user",
      save: jest.fn(),
    });

    await addContactMessage(req, res);

    // expect(res.json()).toBe({
    //   name: "issadw",
    //   email: "issahaddadhaddad@gmail.com",
    //   message: "hhi jesti",
    //   user: "65584f4d4a6ff886a9efc38b",
    //   senderType: "user",
    // });

    newMessageSaveMock.mockRestore();
  });
});
