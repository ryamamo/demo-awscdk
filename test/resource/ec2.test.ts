import { App } from "aws-cdk-lib";
import { DemoStack } from '../../lib/demo-stack';
import { Match, Template } from 'aws-cdk-lib/assertions';

test('SecurityGroup', () => {
    const app = new App();
    const stack = new DemoStack(app, 'VpcStack');
    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::EC2::Instance', 2);
    template.hasResourceProperties('AWS::EC2::Instance', {
        AvailabilityZone: 'ap-northeast-1a',
        IamInstanceProfile: Match.anyValue(),
        ImageId: 'ami-06631ebafb3ae5d34',
        InstanceType: 't2.micro',
        SecurityGroupIds: Match.anyValue(),
        SubnetId: Match.anyValue(),
        Tags: [{
            'Key': 'Name', 'Value': 'undefined-undefined-ec2-1a'
        }]
    });
    template.hasResourceProperties('AWS::EC2::Instance', {
        AvailabilityZone: 'ap-northeast-1c',
        IamInstanceProfile: Match.anyValue(),
        ImageId: 'ami-06631ebafb3ae5d34',
        InstanceType: 't2.micro',
        SecurityGroupIds: Match.anyValue(),
        SubnetId: Match.anyValue(),
        Tags: [{
            'Key': 'Name', 'Value': 'undefined-undefined-ec2-1c'
        }]
    });

});
