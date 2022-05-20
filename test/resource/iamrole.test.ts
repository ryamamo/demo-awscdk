import { App } from "aws-cdk-lib";
import { DemoStack } from '../../lib/demo-stack';
import { Match, Template } from 'aws-cdk-lib/assertions';

test('IamRole', () => {
    const app = new App();
    const stack = new DemoStack(app, 'VpcStack');
    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::IAM::Role', 2);
    template.hasResourceProperties('AWS::IAM::Role', {
        AssumeRolePolicyDocument: {
            Statement: [{
                Effect: 'Allow',
                Principal: {
                    Service: Match.anyValue()
                },
                Action: 'sts:AssumeRole'
            }]
        },
        ManagedPolicyArns: [
            'arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore'
        ],
        RoleName: 'undefined-undefined-role-ec2'
    });
    template.hasResourceProperties('AWS::IAM::Role', {
        AssumeRolePolicyDocument: {
            Statement: [{
                Effect: 'Allow',
                Principal: {
                    Service: 'monitoring.rds.amazonaws.com'
                },
                Action: 'sts:AssumeRole'
            }]
        },
        ManagedPolicyArns: [
            'arn:aws:iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole'
        ],
        RoleName: 'undefined-undefined-role-rds'
    });

    template.resourceCountIs('AWS::IAM::InstanceProfile', 1);
    template.hasResourceProperties('AWS::IAM::InstanceProfile', {
        Roles: Match.anyValue(),
        InstanceProfileName: 'undefined-undefined-role-ec2'
    });
});
