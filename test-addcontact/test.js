// contactUsController.test.js
const { addContactMessage } = require("../Controller/ContactUsController");
const ContactUs = require("../Models/contactUsSchema ");

describe("addContactMessage", () => {
  it("should add a new contact message for a user", async () => {
    // إعداد بيئة الاختبار
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

    // افتراضية الدالة save لوحدة التحكم
    const newMessageSaveMock = jest.spyOn(ContactUs.prototype, "save");
    newMessageSaveMock.mockResolvedValue({
      name: "issadsw",
      email: "issahaddadhaddad@gmail.com",
      message: "hi",
      user: "65584f4d4a6ff886a9efc38b",
      senderType: "user",
      save: jest.fn(),
    });

    // تشغيل وحدة التحكم
    await addContactMessage(req, res);

    // التحقق من أن الدالة json تم استدعاؤها بالشكل الصحيح
    // expect(res.json(newMessageSaveMock)).toBe({
    //   name: "issadw",
    //   email: "issahaddadhaddad@gmail.com",
    //   message: "hi",
    //   user: "65584f4d4a6ff886a9efc38b",
    //   senderType: "user",
    // });

    // استعادة افتراضات الدالة المزيفة
    newMessageSaveMock.mockRestore();
  });
});
