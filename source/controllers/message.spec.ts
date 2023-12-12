import { sendMessage } from './message';
import AWS from 'aws-sdk';
import { Request, Response } from 'express';

jest.mock('aws-sdk', () => {
  const mSNS = { publish: jest.fn() };
  return { SNS: jest.fn(() => mSNS), config: { update: jest.fn() } };
});

describe('sendMessage', () => {
  it('should publish message with correct parameters', async () => {
    const mReq: Partial<Request> = { body: { phoneNumber: '1234567890', message: 'Hello' } };
    const mRes: Partial<Response> = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const mNext = jest.fn();
    const mSNS = new AWS.SNS();
    jest.spyOn(mSNS, 'publish').mockReturnValue({
      promise: () => Promise.resolve({ MessageId: '123' })
    } as AWS.Request<AWS.SNS.PublishResponse, AWS.AWSError>);

    await sendMessage(mReq as Request, mRes as Response, mNext);
    expect(mSNS.publish).toHaveBeenCalledWith(
      {
        Subject: mReq.body.phoneNumber,
        Message: mReq.body.message,
        TopicArn: 'arn:aws:sns:eu-north-1:388071406548:message_to_send',
      },
      expect.any(Function)
    );
  });
});