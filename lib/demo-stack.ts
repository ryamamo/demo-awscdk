import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Vpc } from './resource/vpc';
import { Subnet } from './resource/subnet';
import { InternetGateway } from './resource/internetGateway';
import { ElasticIp } from './resource/elasticIp';
import { NatGateway } from './resource/natGateway';

export class DemoStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    
    const vpc = new Vpc();
    vpc.createResources(this, props);

    const subnet = new Subnet(vpc.vpc);
    subnet.createResources(this, props);

    const internetGateway = new InternetGateway(vpc.vpc);
    internetGateway.createResources(this, props);

    const elasticIp = new ElasticIp();
    elasticIp.createResources(this, props);

    const natGateway = new NatGateway(subnet.public1a, subnet.public1c, elasticIp.ngw1a, elasticIp.ngw1c);
    natGateway.createResources(this, props);
  }
}
