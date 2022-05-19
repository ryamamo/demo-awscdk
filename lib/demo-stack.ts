import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Vpc } from './resource/vpc';
import { Subnet } from './resource/subnet';
import { InternetGateway } from './resource/internetGateway';
import { ElasticIp } from './resource/elasticIp';

export class DemoStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    
    const vpc = new Vpc();
    vpc.createResources(this, props);

    const subnet = new Subnet(vpc.vpc);
    subnet.createResources(this, props);

    const igw = new InternetGateway(vpc.vpc);
    igw.createResources(this, props);

    const ngw = new ElasticIp();
    ngw.createResources(this, props)
  }
}
