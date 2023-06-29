import { useAtom } from "jotai";
import { isClientSuccessResponse } from "../../client";
import { issueTopicsAtom } from "../../states";
import { IssueTopicsAtom } from "../../states/types";

import { IssueTopic } from "../../data.types";

export const useIssuesDataFns = () => {
  const { fetchIssues } = useFetchIssuesAction();

  return { fetchIssues };
};

const useFetchIssuesAction = () => {
  const [, setIssues] = useAtom(issueTopicsAtom);
  const fetchIssues = async () => {
    const response = await fetch("/api/tickets/topics", {
      method: "GET",
      headers: {
        ["Content-Type"]: "application/json",
      },
    });

    const json = await response.json();
    if (response.status == 200 && isClientSuccessResponse<IssueTopic[]>(json)) {
      const { data } = json;
      if (!data) return;

      const toAtom = data.reduce((atom, issue) => {
        if (issue.id in atom) return atom;
        return { ...atom, [issue.id]: { ...issue } };
      }, {} as IssueTopicsAtom);
      setIssues(toAtom);
    }
  };

  return { fetchIssues };
};
