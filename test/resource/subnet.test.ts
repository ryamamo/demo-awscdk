import { App } from "aws-cdk-lib"
import { Template } from 'aws-cdk-lib/assertions';
import { DemoStack } from '../../lib/demo-stack';

test('Subnet', () => {
    const app = new App();
    const stack = new DemoStack(app, 'VpcStack');
    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::EC2::Subnet', 6);
    template.hasResourceProperties('AWS::EC2::Subnet', {
        CidrBlock: '10.0.1.0/24',
        AvailabilityZone: 'ap-northeast-1a',
        Tags: [{ 'Key': 'Name', 'Value': 'undefined-undefined-subnet-public-1a'}]
    });

    template.hasResourceProperties('AWS::EC2::Subnet', {
        CidrBlock: '10.0.2.0/24',
        AvailabilityZone: 'ap-northeast-1c',
        Tags: [{ 'Key': 'Name', 'Value': 'undefined-undefined-subnet-public-1c'}]
    });

    template.hasResourceProperties('AWS::EC2::Subnet', {
        CidrBlock: '10.0.11.0/24',
        AvailabilityZone: 'ap-northeast-1a',
        Tags: [{ 'Key': 'Name', 'Value': 'undefined-undefined-subnet-app-1a'}]
    });

    template.hasResourceProperties('AWS::EC2::Subnet', {
        CidrBlock: '10.0.12.0/24',
        AvailabilityZone: 'ap-northeast-1c',
        Tags: [{ 'Key': 'Name', 'Value': 'undefined-undefined-subnet-app-1c'}]
    });

    template.hasResourceProperties('AWS::EC2::Subnet', {
        CidrBlock: '10.0.21.0/24',
        AvailabilityZone: 'ap-northeast-1a',
        Tags: [{ 'Key': 'Name', 'Value': 'undefined-undefined-subnet-db-1a'}]
    });

    template.hasResourceProperties('AWS::EC2::Subnet', {
        CidrBlock: '10.0.22.0/24',
        AvailabilityZone: 'ap-northeast-1c',
        Tags: [{ 'Key': 'Name', 'Value': 'undefined-undefined-subnet-db-1c'}]
    });
})
