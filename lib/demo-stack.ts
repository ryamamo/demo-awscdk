import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Vpc } from './resource/vpc';
import { Subnet } from './resource/subnet';

export class VpcStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    
    const vpc = new Vpc();
    vpc.createResources(this, props);

    const subnet = new Subnet(vpc.vpc);
    subnet.createResource(this, props);
  }
}
