import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Vpc } from './resource/vpc';
import { Subnet } from './resource/subnet';
import { InternetGateway } from './resource/internetGateway';
import { ElasticIp } from './resource/elasticIp';
import { NatGateway } from './resource/natGateway';
import { RouteTable } from './resource/routetable';
import { NetworkAcl } from './resource/networkAcl';
import { IamRole } from './resource/iamRole';
import { SecurityGroup } from './resource/securityGroup';
import { Ec2 } from './resource/ec2';
import { ApplicationLoadBalancer } from './resource/applicationLoadBalancer';
import { OSecretKey, SecretsManager } from './resource/secretsManager';
import { Rds } from './resource/rds';

export class DemoStack extends Stack {
  public static ec2KeyName?: string;

  constructor(scope: Construct, id: string, ec2KeyName?: string, props?: StackProps) {
    super(scope, id, props);
    DemoStack.ec2KeyName = ec2KeyName;

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

    const routeTable = new RouteTable(
      vpc.vpc,
      subnet.public1a,subnet.public1c,
      subnet.app1a, subnet.app1c,
      subnet.db1a, subnet.db1c,
      internetGateway.igw,
      natGateway.ngw1a, natGateway.ngw1c
    );
    routeTable.createResources(this, props);

    const networkAcl = new NetworkAcl(
      vpc.vpc,
      subnet.public1a,subnet.public1c,
      subnet.app1a, subnet.app1c,
      subnet.db1a, subnet.db1c,
    );
    networkAcl.createResources(this, props);

    const iamRole = new IamRole();
    iamRole.createResources(this, props);

    const securityGroup = new SecurityGroup(vpc.vpc);
    securityGroup.createResources(this, props);

    const ec2 = new Ec2(
      subnet.app1a, subnet.app1c,
      iamRole.instanceProfileEc2,
      securityGroup.ec2Sg,
    );
    ec2.createResources(this, props);

    const alb = new ApplicationLoadBalancer(
      vpc.vpc,
      subnet.public1a, subnet.public1c,
      securityGroup.albSg,
      ec2.instance1a, ec2.instance1c,
    );
    alb.createResources(this, props);

    const secretsManager = new SecretsManager();
    secretsManager.createResources(this, props);

    const rds = new Rds(
      subnet.db1a, subnet.db1c,
      securityGroup.rdsSg,
      secretsManager.rdsClusterSecret,
      iamRole.rdsRole
    );
    rds.createResources(this, props);
  }
}
