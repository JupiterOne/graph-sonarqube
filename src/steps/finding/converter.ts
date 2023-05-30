import {
  createIntegrationEntity,
  Entity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';
import { SonarqubeFinding } from '../../provider/types';

const FINDING_KEY_PREFIX = 'sonarqube-finding';
export function createFindingEntityIdentifier(key: string): string {
  return `${FINDING_KEY_PREFIX}:${key}`;
}

const severityToNumericSeverity = (severity: string): number => {
  switch (severity) {
    case 'BLOCKER':
      return 10;
    case 'CRITICAL':
      return 8;
    case 'MAJOR':
      return 6;
    case 'MINOR':
      return 4;
    case 'INFO':
      return 2;
    default:
      return 0;
  }
};

export function createFindingEntity(finding: SonarqubeFinding): Entity {
  // console.log("finding", finding)
  const { tags, ...rest } = finding;

  return createIntegrationEntity({
    entityData: {
      source: rest,
      assign: {
        _key: createFindingEntityIdentifier(finding.key),
        _type: Entities.FINDING._type,
        _class: Entities.FINDING._class,
        key: finding.key,
        name: finding.hash || finding.key, // fall back to key when hash isn't present
        rule: finding.rule,
        severity: finding.severity?.toLowerCase(),
        component: finding.component,
        project: finding.project,
        line: finding.line,
        hash: finding.hash,
        textRangeStartLine: finding.textRange?.startLine,
        textRangeEndLine: finding.textRange?.endLine,
        textRangeStartOffset: finding.textRange?.startOffset,
        textRangeEndOffset: finding.textRange?.endOffset,
        status: finding.status,
        message: finding.message,
        effort: finding.effort,
        debt: finding.debt,
        author: finding.author,
        createdOn: parseTimePropertyValue(finding.creationDate),
        updatedOn: parseTimePropertyValue(finding.updateDate),
        scope: finding.scope,
        quickFixAvailable: finding.quickFixAvailable,
        category: finding.type,
        open: finding.status === 'OPEN',
        numericSeverity: severityToNumericSeverity(finding.severity),
      },
    },
  });
}
