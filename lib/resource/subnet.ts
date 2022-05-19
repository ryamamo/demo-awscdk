import { CfnSubnet, CfnVPC } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { StackProps } from 'aws-cdk-lib';
import { Resource } from './abstract/resource';

export class Subnet extends Resource {
    public public1a: CfnSubnet;
    public public1c: CfnSubnet;
    public app1a: CfnSubnet;
    public app1c: CfnSubnet;
    public db1a: CfnSubnet;
    public db1c: CfnSubnet;

    private readonly vpc: CfnVPC;

    constructor(vpc: CfnVPC) {
        super();
        this.vpc = vpc;
    }

    createResources(scope: Construct, props?: StackProps) {
        const systemName = props?.stackName;
        const envType = props?.env;

        this.public1a = new CfnSubnet(scope, 'SubnetPublic1a', {
            cidrBlock: '10.0.1.0/24',
            vpcId: this.vpc.ref,
            availabilityZone: 'ap-northeast-1a',
            tags: [{ key: 'Name', value: this.createResourceName(scope, 'subnet-public-1a', props)}]
          });
      
        this.public1c = new CfnSubnet(scope, 'SubnetPublic1c', {
            cidrBlock: '10.0.2.0/24',
            vpcId: this.vpc.ref,
            availabilityZone: 'ap-northeast-1c',
            tags: [{ key: 'Name', value: this.createResourceName(scope, 'subnet-public-1c', props)}]
        });
      
        this.app1a = new CfnSubnet(scope, 'SubnetApp1a', {
            cidrBlock: '10.0.11.0/24',
            vpcId: this.vpc.ref,
            availabilityZone: 'ap-northeast-1a',
            tags: [{ key: 'Name', value: this.createResourceName(scope, 'subnet-app-1a', props)}]
        });
      
        this.app1c = new CfnSubnet(scope, 'SubnetApp1c', {
            cidrBlock: '10.0.12.0/24',
            vpcId: this.vpc.ref,
            availabilityZone: 'ap-northeast-1c',
            tags: [{ key: 'Name', value: this.createResourceName(scope, 'subnet-app-1c', props)}]
        });
      
        this.db1a = new CfnSubnet(scope, 'SubnetDb1a', {
            cidrBlock: '10.0.21.0/24',
            vpcId: this.vpc.ref,
            availabilityZone: 'ap-northeast-1a',
            tags: [{ key: 'Name', value: this.createResourceName(scope, 'subnet-db-1a', props)}]
        });
      
        this.db1c = new CfnSubnet(scope, 'SubnetDb1c', {
            cidrBlock: '10.0.22.0/24',
            vpcId: this.vpc.ref,
            availabilityZone: 'ap-northeast-1c',
            tags: [{ key: 'Name', value: this.createResourceName(scope, 'subnet-db-1c', props)}]
        });
    }
}