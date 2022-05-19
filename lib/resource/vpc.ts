import { CfnVPC } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { StackProps } from 'aws-cdk-lib';

export class Vpc {
  public vpc: CfnVPC;

  constructor() {};

  public createResources(scope: Construct, props?: StackProps) {
    const systemName = props?.stackName;
    const envType = props?.env;

    this.vpc = new CfnVPC(scope, 'VpcStackcdk ', {
      cidrBlock: '10.0.0.0/16',
      tags: [{ key: 'Name', value: `${systemName}-${envType}-vpc`}]
    });
  }
}