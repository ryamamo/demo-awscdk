import { StackProps } from "aws-cdk-lib";
import { CfnSecret } from "aws-cdk-lib/aws-secretsmanager";
import { Construct } from "constructs";
import { Resource } from './abstract/resource';


export const OSecretKey = {
    MasterUsername: 'MasterUsername',
    MasterUserPassword: 'MasterUserPassword'
} as const;
type SecretKey = typeof OSecretKey[keyof typeof OSecretKey];

interface ResourceInfo {
    readonly id: string;
    readonly description: string;
    readonly generateSecretString: CfnSecret.GenerateSecretStringProperty;
    readonly resourceName: string;
    readonly assgin: (secret: CfnSecret) => void;
}

export class SecretsManager extends Resource {
    public rdsClusterSecret: CfnSecret

    private static readonly rdsClusterMasterUsername = 'admin';
    private readonly resources: ResourceInfo[] = [{
        id: 'SecretRdsCluster',
        description: 'for RDS cluster',
        generateSecretString: {
            excludeCharacters: '"@/\\\'',
            generateStringKey: OSecretKey.MasterUserPassword,
            passwordLength: 16,
            secretStringTemplate: `{"${OSecretKey.MasterUsername}": "${SecretsManager.rdsClusterMasterUsername}"}`
        },
        resourceName: 'secrets-rds-cluster',
        assgin: secret => this.rdsClusterSecret = secret
    }];

    constructor() {
        super();
    };

    createResources(scope: Construct, props?: StackProps | undefined): void {
        for (const resourceInfo of this.resources) {
            const secret = this.createSecret(scope, resourceInfo, props);
            resourceInfo.assgin(secret);
        }
    }

    public static getDynamicReference(secret: CfnSecret, secretKey: SecretKey): string {
        return `{{resolve:secretsmanager:${secret.ref}:SecretString:${secretKey}}}`
    }

    private createSecret(scope: Construct, resourceInfo: ResourceInfo, props?: StackProps): CfnSecret {
        const secret = new CfnSecret(scope, resourceInfo.id, {
            description: resourceInfo.description,
            generateSecretString: resourceInfo.generateSecretString,
            name: this.createResourceName(scope, resourceInfo.resourceName, props)
        });

        return secret;
    }
}
