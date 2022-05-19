import { StackProps } from 'aws-cdk-lib';
import { CfnInternetGateway, CfnVPC, CfnVPCGatewayAttachment } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { Resource } from './abstract/resource';

export class InternetGateway extends Resource {
    public igw: CfnInternetGateway;

    private readonly vpc: CfnVPC;

    constructor(vpc: CfnVPC) {
        super();
        this.vpc = vpc;
    }

    createResources(scope: Construct, props?: StackProps | undefined): void {
        this.igw = new CfnInternetGateway(scope, 'InternetGateway', {
            tags: [{ key: 'Name', value: this.createResourceName(scope, 'igw', props)}]
        });

        new CfnVPCGatewayAttachment(scope, 'VpcGatewayAttachment', {
            vpcId: this.vpc.ref,
            internetGatewayId: this.igw.ref
        });
    }
}
