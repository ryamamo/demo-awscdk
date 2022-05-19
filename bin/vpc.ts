#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { VpcStack } from '../lib/demo-stack';

const app = new cdk.App();

const projectName = app.node.tryGetContext('projectName');
const envType = app.node.tryGetContext('envType');

new VpcStack(app, `${projectName}-${envType}-Stack`, {
  env: envType,
  stackName: projectName
});