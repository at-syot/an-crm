// daos
export type IssueTopicDAO = {
  id: string;
  name: string;
  active: boolean;
  parentId?: string;
};
export type IssueTopicListDAO = IssueTopicDAO[];
