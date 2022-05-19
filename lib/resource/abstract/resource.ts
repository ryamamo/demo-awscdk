import { Construct } from 'constructs';
import { StackProps } from 'aws-cdk-lib';


export abstract class Resource {
    constructor() {}

    abstract createResources(scope: Construct, props?: StackProps): void;

    protected createResourceName(scope: Construct, originalName: string, props?: StackProps): string {
        const systemName = props?.stackName;
        const envType = props?.env;
        const resouceNamePrefix = `${systemName}-${envType}-`;

        return `${resouceNamePrefix}${originalName}`;
    }
}
