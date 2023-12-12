import { Request, Response, NextFunction } from 'express';
import AWS from 'aws-sdk';

AWS.config.update({
  region: 'eu-north-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const sns = new AWS.SNS();

const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
  let title: string = req.body.phoneNumber;
  let body: string = req.body.message;

  let params = {
    Subject: title,
    Message: body,
    TopicArn: 'arn:aws:sns:eu-north-1:388071406548:message_to_send',
  };

  sns.publish(params, function(err, data) {
    if (err) {
      console.log(err, err.stack); // an error occurred
      res.status(500).json({ error: err });
    } else {
      console.log(data); // successful response
      res.status(200).json({ message: data });
    }
  });
};

export { sendMessage };