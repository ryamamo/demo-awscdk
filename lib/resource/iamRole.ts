import { CfnInstanceProfile, CfnRole, Effect, PolicyDocument, PolicyStatement, PolicyStatementProps, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { Construct } from 'constructs';
import { StackProps } from 'aws-cdk-lib';
import { Resource } from "./abstract/resource";
import { assert } from "console";


interface ResourceInfo {
    readonly id: string;
    readonly policyStatementProps: PolicyStatementProps;
    readonly managedPolicyArn: string[];
    readonly roleName: string;
    readonly assign: (role: CfnRole)  => void;
}

export class IamRole extends Resource {
    public ec2Role: CfnRole;
    public rdsRole: CfnRole;
    public instanceProfileEc2: CfnInstanceProfile;

    private readonly resources: ResourceInfo[] = [
        {
            id: 'RoleEc2',
            policyStatementProps: {
                effect: Effect.ALLOW,
                principals: [new ServicePrincipal('ec2.amazonaws.com')],
                actions: ['sts:AssumeRole']
            },
            managedPolicyArn: [
                'arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore'
            ],
            roleName: 'role-ec2',
            assign: role => this.ec2Role = role
        },
        {
            id: 'RoleRds',
            policyStatementProps: {
                effect: Effect.ALLOW,
                principals: [new ServicePrincipal('monitoring.rds.amazonaws.com')],
                actions: ['sts:AssumeRole']
            },
            managedPolicyArn: [
                'arn:aws:iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole'
            ],
            roleName: 'role-rds',
            assign: role => this.rdsRole = role
        }
    ];

    constructor() {
        super();
    }

    createResources(scope: Construct, props?: StackProps | undefined): void {
        for (const resourceInfo of this.resources) {
            const role = this.createRole(scope, resourceInfo, props);
            resourceInfo.assign(role);
        }
        this.instanceProfileEc2 = new CfnInstanceProfile(scope, 'InstanceProfileEc2', {
            roles: [this.ec2Role.ref],
            instanceProfileName: this.ec2Role.roleName
        })
    }

    private createRole(scope: Construct, resourceInfo: ResourceInfo, props?: StackProps): CfnRole {
        const policyStatement = new PolicyStatement(resourceInfo.policyStatementProps);

        const policyDocument = new PolicyDocument({
            statements: [policyStatement]
        });

        const role = new CfnRole(scope, resourceInfo.id, {
            assumeRolePolicyDocument: policyDocument,
            managedPolicyArns: resourceInfo.managedPolicyArn,
            roleName: this.createResourceName(scope, resourceInfo.roleName, props)
        });

        return role;
    }
}
