"use client";

import { MenuItem, TextField } from "@mui/material";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { issueTopicsAtom } from "../../states";
import type { IssueTopicItemAtom, IssueTopicsAtom } from "../../states";
import type { IssueTopicListDAO } from "../../domains/issueTopic";

type CreateTicketSelectIssueProps = {
  error: boolean;
  onSelect: (issueId: string) => void;
};
export default function CreateTicketSelectIssue(
  props: CreateTicketSelectIssueProps
) {
  const { issueTopics } = useFetchIssueTopicsData();
  const toRenderIssueTopics = Object.entries(issueTopics).map(
    ([, issueTopic]) => issueTopic
  );
  const [selectedValue, setSelectedValue] = useState<string>(defaultIssueValue);
  const onSelectChanged = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(value);
    props.onSelect(value);
  };

  return (
    <TextField
      select
      size="small"
      label="Select issue"
      value={selectedValue}
      onChange={onSelectChanged}
      error={props.error}
    >
      <MenuItem key={defaultIssueValue} value={defaultIssueValue}>
        -
      </MenuItem>
      {toRenderIssueTopics.map(({ id, name }) => (
        <MenuItem key={id} value={id}>
          {name}
        </MenuItem>
      ))}
    </TextField>
  );
}
export const defaultIssueValue = "999";

// TODO: should process when app start
const useFetchIssueTopicsData = () => {
  const [issueTopics, setIssueTopics] = useAtom(issueTopicsAtom);
  useEffect(() => {
    fetch("/api/tickets/topics", {
      method: "GET",
      headers: {
        ["Content-Type"]: "application/json",
      },
    }).then((response) => {
      if (response.status !== 200) {
        return;
      }

      // transform data to dao to atom type
      response
        .json()
        .then((responseJson: IssueTopicListDAO) => {
          return responseJson.reduce<IssueTopicsAtom>((atom, dao) => {
            if (dao.id in atom) return atom;
            atom[dao.id] = { ...dao } as IssueTopicItemAtom;

            return atom;
          }, {});
        })
        .then((issueTopicsAtom) => setIssueTopics(issueTopicsAtom));
    });
  });

  return { issueTopics };
};
