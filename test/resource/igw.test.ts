import { App } from "aws-cdk-lib";
import { DemoStack } from '../../lib/demo-stack';
import { Template } from 'aws-cdk-lib/assertions';

test('InternetGateway', () => {
    const app = new App();
    const stack = new DemoStack(app, 'VpcStack');
    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::EC2::InternetGateway', 1);
    template.hasResourceProperties('AWS::EC2::InternetGateway', {
        Tags: [{ 'Key': 'Name', 'Value': 'undefined-undefined-igw'}]
    });
});