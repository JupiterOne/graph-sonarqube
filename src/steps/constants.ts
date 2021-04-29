export const Steps = {
  PROJECTS: 'fetch-projects',
  USER_GROUPS: 'fetch-user-groups',
};

export const Entities = {
  PROJECT: {
    resourceName: 'Project',
    _type: 'sonarqube_project',
    _class: ['Project'],
  },
  USER_GROUP: {
    resourceName: 'UserGroup',
    _type: 'sonarqube_user_group',
    _class: ['UserGroup'],
  },
};
