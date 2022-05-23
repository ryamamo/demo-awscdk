import { CfnListener, CfnLoadBalancer, CfnTargetGroup, CfnTargetGroupProps } from "aws-cdk-lib/aws-elasticloadbalancingv2";
import { Resource } from "./abstract/resource";
import { CfnSubnet, CfnVPC, CfnInstance, CfnSecurityGroup } from 'aws-cdk-lib/aws-ec2';
import { StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";

interface TargetGroupInfo {
    readonly id: string;
    readonly resourceName: string;
    readonly port: number;
    readonly protocol: string;
    readonly targetType: string;
    readonly targets: () => string[];
    readonly vpc: () => string;
}

interface ListenerInfo {
    readonly id: string;
    readonly port: number;
    readonly protocol: string;
}

interface ResourceInfo {
    readonly ipAddressType: string;
    readonly id: string;
    readonly resourceName: string;
    readonly schema: string;
    readonly securityGroup: () => string;
    readonly subnets: () => string[];
    readonly type: string;
    readonly targetGroups: TargetGroupInfo;
    readonly listeners: ListenerInfo;
    readonly assign: (loadBalancer: CfnLoadBalancer) => void;
}

export class ApplicationLoadBalancer extends Resource {
    public loadBalancer: CfnLoadBalancer;

    private readonly vpc: CfnVPC;
    private readonly subnetPublic1a: CfnSubnet;
    private readonly subnetPublic1c: CfnSubnet;
    private readonly securityGroup: CfnSecurityGroup;
    private readonly ec2Instance1a: CfnInstance;
    private readonly ec2Instance1c: CfnInstance;
    private readonly resources: ResourceInfo[] = [
        {
            ipAddressType: 'ipv4',
            id: 'Alb',
            resourceName: 'alb',
            schema: 'internet-facing',
            securityGroup: () => this.securityGroup.ref,
            subnets: () => [this.subnetPublic1a.ref, this.subnetPublic1c.ref],
            type: 'application',
            targetGroups: {
                id: 'AlbTargetGroup',
                resourceName: 'tg',
                port: 80,
                protocol: 'HTTP',
                targetType: 'instance',
                targets: () => [this.ec2Instance1a.ref, this.ec2Instance1c.ref],
                vpc: () => this.vpc.ref
            },
            listeners: {
                id: 'AlbListener',
                port: 80,
                protocol: 'HTTP'
            },
            assign: loadbalancer => this.loadBalancer = loadbalancer
        }
    ]

    constructor(
        vpc: CfnVPC,
        subnetPublic1a: CfnSubnet,
        subnetPublic1c: CfnSubnet,
        securityGroup: CfnSecurityGroup,
        ec2Instance1a: CfnInstance,
        ec2Instance1c: CfnInstance,
    ) {
        super();
        this.vpc = vpc;
        this.subnetPublic1a = subnetPublic1a;
        this.subnetPublic1c = subnetPublic1c;
        this.securityGroup = securityGroup;
        this.ec2Instance1a = ec2Instance1a;
        this.ec2Instance1c = ec2Instance1c;
    };

    createResources(scope: Construct, props?: StackProps | undefined): void {
        for (const resourceInfo of this.resources) {
            const targetInfo = resourceInfo.targetGroups
            const loadBalancer = this.createLoadBalancer(scope, resourceInfo, props);
            const targetGroup = this.createTargetGroup(scope, targetInfo, props);
            this.createListener(scope, resourceInfo, loadBalancer, targetGroup);
            resourceInfo.assign(loadBalancer);
        }
    }

    private createLoadBalancer(scope: Construct, resourceInfo: ResourceInfo, props?: StackProps): CfnLoadBalancer {
        const loadBalancer = new CfnLoadBalancer(scope, resourceInfo.id, {
            ipAddressType: resourceInfo.ipAddressType,
            name: this.createResourceName(scope, resourceInfo.resourceName, props),
            scheme: resourceInfo.schema,
            securityGroups: [resourceInfo.securityGroup()],
            subnets: resourceInfo.subnets(),
            type: resourceInfo.type
        });

        return loadBalancer;
    }

    private createTargetGroup(scope: Construct, targetInfo: TargetGroupInfo, props?: StackProps): CfnTargetGroup {
        const targetGroup = new CfnTargetGroup(scope, targetInfo.id, {
            name: this.createResourceName(scope, targetInfo.resourceName, props),
            port: targetInfo.port,
            protocol: targetInfo.protocol,
            targetType: targetInfo.targetType,
            targets: [
                {
                    id: targetInfo.targets()[0],
                },{
                    id: targetInfo.targets()[1]
                }
            ],
            vpcId: this.vpc.ref
        });
        return targetGroup;
    }

    private createListener(scope: Construct, resourceInfo: ResourceInfo, loadBalancer: CfnLoadBalancer, targetGroup: CfnTargetGroup) {
        new CfnListener(scope, resourceInfo.listeners.id, {
            defaultActions: [{
                type: 'forward',
                forwardConfig: {
                    targetGroups: [{
                        targetGroupArn: targetGroup.ref,
                        weight: 1
                    }]
                }
            }],
        loadBalancerArn: loadBalancer.ref,
        port: resourceInfo.listeners.port,
        protocol: resourceInfo.listeners.protocol
        });
    }
}
