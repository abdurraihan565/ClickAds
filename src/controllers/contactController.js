const createError = require('http-errors');
const Contact = require('../models/contactModels');
const { successResponse } = require('./responseControllers');

const { emailWithNodeMailer } = require('../helper/email');
const { findWithId } = require('../services/findItem');

const handleContact = async (req, res, next) => {
  try {
    const { email, message } = req.body;

    const contact = await Contact.create({
      email: email,
      message: message,
    });

    //PREPERE EMAIL
    const emailData = {
      email,
      subject: ' Clickads- Your Message  here ',
      html: `
              <h2> Hellow ${email} </h2>
                <p> Thanks For Message Us .Your Message is Processing .In The near future our employees will consider it. You will see the replay on Your Email very soon . </p>  
                <p>Thank you for your request to our support team. We will process your Message as soon as it is possible and one of our support professionals will gladly provide you with the assistance you need. </p>
                <br></br>
                <p>Thank you for using our service!</p>

                `,
    };

    // send email with nodeMailer
    try {
      emailWithNodeMailer(emailData);
    } catch (emailError) {
      next(createError(500, 'Fail to send Request email'));
      return;
    }

    return successResponse(res, {
      statusCode: 200,
      message: ` Thanks For Message us. Your Request is Accepted. Please Check ${email} email. `,
      payload: { contact },
    });
  } catch (error) {
    next(error);
  }
};

//replay message
const handleReplayMessage = async (req, res, next) => {
  try {
    const { email, message } = req.body;

    //PREPERE EMAIL
    const emailData = {
      email,
      subject: ' Clickads - Message Response here ',
      html: `
              <h2> Hellow ${email} </h2>
                <p> You are receiving this message because you have submitted a message at [clickads.com ] recently. </p>  
                <p>${message}</p>
                <br></br>
                <p>Thank you for using our service!</p>

                `,
    };

    // send email with nodeMailer
    try {
      emailWithNodeMailer(emailData);
    } catch (emailError) {
      next(createError(500, 'Fail to send Request email'));
      return;
    }

    return successResponse(res, {
      statusCode: 200,
      message: ` Message was send ${email} email sucessfully submitted`,
    });
  } catch (error) {
    next(error);
  }
};

//get all message
const AllGetMessage = async (req, res, next) => {
  try {
    const search = req.query.search || '';
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 100;

    const searchRegExp = new RegExp('.*' + search + '.*', 'i');

    filter = {
      idAdmin: { $ne: true },
      $or: [
        //{ name: { $regex: searchRegExp } },
        { email: { $regex: searchRegExp } },
        // { phone: { $regex: searchRegExp } },
      ],
    };

    const message = await Contact.find(filter)
      .limit(limit)
      .skip((page - 1) * limit);

    const count = await Contact.find(filter).countDocuments();
    if (!message) throw createError('404', 'message not found');

    return successResponse(res, {
      statusCode: 200,
      message: 'All Message were return successfully',
      payload: {
        message,
        pagination: {
          totalPages: Math.ceil(count / limit),
          currentPage: page,
          previousPage: page - 1 > 0 ? page - 1 : null,
          nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
// delete signle message
const handleDeleteMessageById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const contactMessage = await findWithId(Contact, id);
    if (!contactMessage) {
      throw createError(404, ' Contact message Not Found.');
    }
    await Contact.findByIdAndDelete({
      _id: id,
    });
    return successResponse(res, {
      statusCode: 200,
      message: 'Message was deleted succesfully',
      payload: contactMessage,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleContact,
  handleReplayMessage,
  AllGetMessage,
  handleDeleteMessageById,
};
