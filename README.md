# aws_sms
AWS Message Sender

# History

1. Initialised npm
2. Installed typescript
3. Setup directory structure
4. Setup typescript
5. Setup server/routes/controller
6. Quick manual test with Postman
7. Installed jest
8. Setup jest
9. Wrote trivial test with jest to confirm setup
10. Replace direct build process with webpack
11. Test build process with webpack (little hickup with dependencies on the generated file, but fixed)
12. Created AWS account
13. Created SNS topic + read docs (first timer here in AWS! Used Azure/IBM Cloud in the past)
14. Created logic to address the queue arn from my api
15. Learning about aws-sdk, and authentication
16. Going for access key approach, even if not recommended, as it's simpler (this is just a prototype!). I'll make them process.env.
17. Seems like I managed to send a message on SNS successfully... can't find a way to see it on AWS UI though. I'll create the SQS and see if it can be pulled from there somehow.
18. Created SQS and manually clicked on "poll". The message sent at previous step seems to be lost, but I managed to send other 2 new ones okay and they appear!
19. Reading docs on how to connect SQS and aws lambda...
20. Created lambda function first
21. Created trigger on SQS. Uh, have to amend the execution role
22. Edited the permission json on the lambda function and added "Read" for the specific SQS. Quite a lot of steps, wonder if could have been done quicker.
23. Uhmm... it needs "Delete" too. Okay, setting that up.
24. Uhmmm... it needs more stuff. Usually I'm more careful, but this time I'll give every possible access to the SQS queue.
25. Cool! Lambda trigger is all set on the SQS.
26. Testing sending a message
27. CloudWatch logs are a bit laggy, but they detect function invocation after I send requests to my local api
28. Reading docs on how to make the lambda send sms...
29. Ok, first, I created a lambda that reads the message from the queue.
30. Cool! I can send an API request from my local server, that goes to SNS, that goes to SQS, and I can see the message in Cloudwatch
31. Uhm. I initially set the lambda runtime to javascript, but all examples I can find use python to send message (after setting up a pinpoint). Switching to python!
32. Setting up Pinpoint, in order to use it via boto3 library for python
33. Bit of struggle, as many example use pinpointv1, but now pinpoint has changed in version 2
34. Seems okay now, but need roles for messages on the lambda! Adding them...
35. I managed to sent the message to my phone!
36. Simplified tests

A lot happened on AWS UI, configuring stuff... I can share the code of the lambda, but the rest was pretty much clicking buttons and copy pasting ids

```python

import json
import boto3

pinpoint = boto3.client('pinpoint-sms-voice-v2')

def handler(event, context):
    print(event)
    data = json.loads(event['Records'][0]['body'])
    number = data['Subject']
    text = data['Message']
    print(number, text)

    configuration_set = "conf-set-test-phone"
    destination_number = data['Subject']
    message_body = data['Message']
    message_type = "TRANSACTIONAL"
    ttl = 120

    message_id = pinpoint.send_text_message(
        ConfigurationSetName=configuration_set,
        DestinationPhoneNumber=destination_number,
        MessageBody=message_body,
        MessageType=message_type,
        TimeToLive=ttl
    )
    
    print(message_id)

```