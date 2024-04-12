import { createProjectEntity } from './converter';
import { SonarqubeProject } from '../../provider/types/v1';

describe('#createProjectEntity', () => {
  test('should convert to entity', () => {
    const project = {
      key: 'project-key-1',
      name: 'Project Name 1',
      qualifier: 'TRK',
      visibility: 'public',
      lastAnalysisDate: '2017-03-01T11:39:03+0300',
      revision: 'cfb82f55c6ef32e61828c4cb3db2da12795fd767',
    } as SonarqubeProject;

    const entity = createProjectEntity(project);

    expect(entity).toEqual(
      expect.objectContaining({
        _key: 'sonarqube-project:project-key-1',
        _type: 'sonarqube_project',
        _class: ['Project'],
        key: 'project-key-1',
        name: 'Project Name 1',
        qualifier: 'TRK',
        visibility: 'public',
        lastAnalysisDate: '2017-03-01T11:39:03+0300',
        revision: 'cfb82f55c6ef32e61828c4cb3db2da12795fd767',
        _rawData: [
          {
            name: 'default',
            rawData: project,
          },
        ],
      }),
    );
  });
});
