import { App } from "aws-cdk-lib"
import { Template } from 'aws-cdk-lib/assertions';
import { DemoStack } from '../lib/demo-stack';

test('Context', () => {
    const app = new App();
    const stack = new DemoStack(app, 'DemoStack');
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::EC2::VPC', {
        Tags: [{ 'Key': 'Name', 'Value': 'undefined-undefined-vpc'}]
    });
})