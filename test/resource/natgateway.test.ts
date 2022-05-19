import { App } from "aws-cdk-lib"
import { Template } from 'aws-cdk-lib/assertions';
import { DemoStack } from '../../lib/demo-stack';

test('Subnet', () => {
    const app = new App();
    const stack = new DemoStack(app, 'VpcStack');
    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::EC2::NatGateway', 2);
    template.hasResourceProperties('AWS::EC2::NatGateway', {
        Tags: [{ 'Key': 'Name', 'Value': 'undefined-undefined-ngw-1a'}]
    });
    template.hasResourceProperties('AWS::EC2::NatGateway', {
        Tags: [{ 'Key': 'Name', 'Value': 'undefined-undefined-ngw-1c'}]
    });
});
