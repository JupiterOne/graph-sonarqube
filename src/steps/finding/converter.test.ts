import { createFindingEntity } from './converter';
import { SonarqubeFinding } from '../../provider/types';

describe('#createFindingEntity', () => {
  test('should convert to entity', () => {
    const project = {
      key: '12345',
      rule: 'javascript:S1234',
      severity: 'CRITICAL',
      component: '12345',
      project: 'Test12345hvhIyiTjXiMI4DI',
      line: 235,
      hash: '81234598a9eac8',
      textRange: {
        startLine: 235,
        endLine: 235,
        startOffset: 2,
        endOffset: 110,
      },
      flows: [],
      status: 'OPEN',
      message: 'Unexpected var, use let or const instead.',
      effort: '5min',
      debt: '5min',
      author: 'sns@vuln.in',
      tags: ['bad-practice', 'es2015'],
      creationDate: '2008-07-31T16:52:52+0000',
      updateDate: '2012-12-15T02:41:31+0000',
      type: 'CODE_SMELL',
      scope: 'MAIN',
      quickFixAvailable: true,
    } as SonarqubeFinding;

    const entity = createFindingEntity(project);

    expect(entity).toEqual(
      expect.objectContaining({
        _class: ['Finding'],
        _key: 'sonarqube-finding:12345',
        _rawData: [
          {
            name: 'default',
            rawData: {
              author: 'sns@vuln.in',
              component: '12345',
              creationDate: '2008-07-31T16:52:52+0000',
              debt: '5min',
              effort: '5min',
              flows: [],
              hash: '81234598a9eac8',
              key: '12345',
              line: 235,
              message: 'Unexpected var, use let or const instead.',
              project: 'Test12345hvhIyiTjXiMI4DI',
              quickFixAvailable: true,
              rule: 'javascript:S1234',
              scope: 'MAIN',
              severity: 'CRITICAL',
              status: 'OPEN',
              textRange: {
                endLine: 235,
                endOffset: 110,
                startLine: 235,
                startOffset: 2,
              },
              type: 'CODE_SMELL',
              updateDate: '2012-12-15T02:41:31+0000',
            },
          },
        ],
        _type: 'sonarqube_finding',
        active: undefined,
        author: 'sns@vuln.in',
        category: 'CODE_SMELL',
        component: '12345',
        createdOn: 1217523172000,
        debt: '5min',
        displayName: '81234598a9eac8',
        effort: '5min',
        hash: '81234598a9eac8',
        key: '12345',
        line: 235,
        message: 'Unexpected var, use let or const instead.',
        name: '81234598a9eac8',
        numericSeverity: 8,
        open: true,
        project: 'Test12345hvhIyiTjXiMI4DI',
        quickFixAvailable: true,
        rule: 'javascript:S1234',
        scope: 'MAIN',
        severity: 'critical',
        status: 'OPEN',
        textRangeEndLine: 235,
        textRangeEndOffset: 110,
        textRangeStartLine: 235,
        textRangeStartOffset: 2,
        updatedOn: 1355539291000,
      }),
    );
  });
});
