import { App } from "aws-cdk-lib";
import { DemoStack } from '../../lib/demo-stack';
import { Template } from 'aws-cdk-lib/assertions';

test('ElasticIp', () => {
    const app = new App();
    const stack = new DemoStack(app, 'VpcStack');
    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::EC2::EIP', 2);
    template.hasResourceProperties('AWS::EC2::EIP', {
        Tags: [{ 'Key': 'Name', 'Value': 'undefined-undefined-eip-ngw-1a'}]
    });
    template.hasResourceProperties('AWS::EC2::EIP', {
        Tags: [{ 'Key': 'Name', 'Value': 'undefined-undefined-eip-ngw-1c'}]
    });
});
