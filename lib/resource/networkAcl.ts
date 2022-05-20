import { StackProps } from "aws-cdk-lib";
import { CfnNetworkAcl, CfnNetworkAclEntry, CfnSubnet, CfnSubnetNetworkAclAssociation, CfnVPC } from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";
import { Resource } from "./abstract/resource";


interface AssociationInfo {
    readonly id: string;
    readonly subnetId: () => string;
}

interface EntryInfo {
    readonly id: string;
    readonly protocol: number;
    readonly ruleAction: string;
    readonly ruleNumber: number;
    readonly cidrBlock: string;
    readonly egress: boolean;
}

interface ResourceInfo {
    readonly id: string;
    readonly resourceName: string;
    readonly entries: EntryInfo[];
    readonly associations: AssociationInfo[];
    readonly assign: (networkAcl: CfnNetworkAcl) => void;
}

export class NetworkAcl extends Resource {
    public publicAcl: CfnNetworkAcl;
    public app: CfnNetworkAcl;
    public db: CfnNetworkAcl;

    private readonly vpc: CfnVPC;
    private readonly subnetPublic1a: CfnSubnet;
    private readonly subnetPublic1c: CfnSubnet;
    private readonly subnetApp1a: CfnSubnet;
    private readonly subnetApp1c: CfnSubnet;
    private readonly subnetDb1a: CfnSubnet;
    private readonly subnetDb1c: CfnSubnet;
    private readonly resourcesInfo: ResourceInfo[] = [
        {
            id: 'NetworkAclPublic',
            resourceName: 'nacl-public',
            entries: [
                {
                    id: 'NetworkAclEntryInboundPublic',
                    protocol: -1,
                    ruleAction: 'allow',
                    ruleNumber: 100,
                    cidrBlock: '0.0.0.0/0',
                    egress: false
                },
                {
                    id: 'NetworkAclEntryOutboundPublic',
                    protocol: -1,
                    ruleAction: 'allow',
                    ruleNumber: 100,
                    cidrBlock: '0.0.0.0/0',
                    egress: true
                }
            ],
            associations: [
                {
                    id: 'NetworkAclAssociationPublic1a',
                    subnetId: () => this.subnetPublic1a.ref
                },
                {
                    id: 'NetworkAclAssociationPublic1c',
                    subnetId: () => this.subnetPublic1c.ref
                }
            ],
            assign: networkAcl => this.publicAcl = networkAcl
        },
        {
            id: 'NetworkAclApp',
            resourceName: 'nacl-app',
            entries: [
                {
                    id: 'NetworkAclEntryInboundApp',
                    protocol: -1,
                    ruleAction: 'allow',
                    ruleNumber: 100,
                    cidrBlock: '0.0.0.0/0',
                    egress: false
                },
                {
                    id: 'NetworkAclEntryOutboundApp',
                    protocol: -1,
                    ruleAction: 'allow',
                    ruleNumber: 100,
                    cidrBlock: '0.0.0.0/0',
                    egress: true
                }
            ],
            associations: [
                {
                    id: 'NetworkAclAssociationApp1a',
                    subnetId: () => this.subnetApp1a.ref
                },
                {
                    id: 'NetworkAclAssociationApp1c',
                    subnetId: () => this.subnetApp1c.ref
                }
            ],
            assign: networkAcl => this.app = networkAcl
        },
        {
            id: 'NetworkAclDb',
            resourceName: 'nacl-db',
            entries: [
                {
                    id: 'NetworkAclEntryInboundDb',
                    protocol: -1,
                    ruleAction: 'allow',
                    ruleNumber: 100,
                    cidrBlock: '0.0.0.0/0',
                    egress: false
                },
                {
                    id: 'NetworkAclEntryOutboundDb',
                    protocol: -1,
                    ruleAction: 'allow',
                    ruleNumber: 100,
                    cidrBlock: '0.0.0.0/0',
                    egress: true
                }
            ],
            associations: [
                {
                    id: 'NetworkAclAssociationDb1a',
                    subnetId: () => this.subnetDb1a.ref
                },
                {
                    id: 'NetworkAclAssociationDb1c',
                    subnetId: () => this.subnetDb1c.ref
                }
            ],
            assign: networkAcl => this.db = networkAcl
        }
    ];

    constructor(
        vpc: CfnVPC,
        subnetPublic1a: CfnSubnet,
        subnetPublic1c: CfnSubnet,
        subnetApp1a: CfnSubnet,
        subnetApp1c: CfnSubnet,
        subnetDb1a: CfnSubnet,
        subnetDb1c: CfnSubnet,
    ) {
        super();
        this.vpc = vpc;
        this.subnetPublic1a = subnetPublic1a;
        this.subnetPublic1c = subnetPublic1c;
        this.subnetApp1a = subnetApp1a;
        this.subnetApp1c = subnetApp1c;
        this.subnetDb1a = subnetDb1a;
        this.subnetDb1c = subnetDb1c;
    }

    createResources(scope: Construct, props?: StackProps | undefined): void {
        for (const resourceInfo of this.resourcesInfo) {
            const networkAcl = this.createNetworkAcl(scope, resourceInfo, props);
            resourceInfo.assign(networkAcl);
        }
        
    }

    private createNetworkAcl(scope: Construct, resourceInfo: ResourceInfo, props?: StackProps) {
        const networkAcl = new CfnNetworkAcl(scope, resourceInfo.id, {
            vpcId: this.vpc.ref,
            tags: [{
                key: 'Name',
                value: this.createResourceName(scope, resourceInfo.resourceName, props)
            }]
        });

        for (const entryInfo of resourceInfo.entries) {
            this.createEntry(scope, entryInfo, networkAcl);
        }

        for (const associationInfo of resourceInfo.associations) {
            this.createAssociation(scope, associationInfo, networkAcl);
        }

        return networkAcl;
    }

    private createEntry(scope: Construct, entryInfo: EntryInfo, networkAcl: CfnNetworkAcl) {
        new CfnNetworkAclEntry(scope, entryInfo.id, {
            networkAclId: networkAcl.ref,
            protocol: entryInfo.protocol,
            ruleAction: entryInfo.ruleAction,
            ruleNumber: entryInfo.ruleNumber,
            cidrBlock: entryInfo.cidrBlock,
            egress: entryInfo.egress
        });
    }

    private createAssociation(scope: Construct, associationInfo: AssociationInfo, networkAcl: CfnNetworkAcl) {
        new CfnSubnetNetworkAclAssociation(scope, associationInfo.id, {
            networkAclId: networkAcl.ref,
            subnetId: associationInfo.subnetId()
        });
    }
}
