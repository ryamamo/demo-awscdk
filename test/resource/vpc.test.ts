import { App } from "aws-cdk-lib"
import { Template } from 'aws-cdk-lib/assertions';
import { DemoStack } from '../../lib/demo-stack';

test('Vpc', () => {
    const app = new App();

    const env: any = 'stg';
    const stackName = 'demo'

    const stack = new DemoStack(app, 'VpcStack', {
        env: env,
        stackName: stackName
    });

    const template = Template.fromStack(stack)
    template.resourceCountIs('AWS::EC2::VPC', 1);
    template.hasResourceProperties('AWS::EC2::VPC', {
        CidrBlock: '10.0.0.0/16',
        Tags: [{ 'Key': 'Name', 'Value': 'demo-stg-vpc'}]
    });

})
