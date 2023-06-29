import { MenuItem, TextField } from "@mui/material";
import { useAtom } from "jotai";
import { issueTopicsAtom } from "../../states";
import { IssueTopic } from "../../data.types";
import { useState } from "react";

export type SelectIssuesProps = {
  onSelected: (issueId: string) => void;
  error?: boolean;
};
export default function SelectIssues({
  onSelected,
  error = false,
}: SelectIssuesProps) {
  const [issues] = useAtom(issueTopicsAtom);
  const displayIssues = Object.entries(issues).reduce((_issues, [, atom]) => {
    _issues.push(atom);
    return _issues;
  }, [] as IssueTopic[]);

  const [selectedValue, setSelectedValue] = useState<string>(defaultIssueValue);
  const onSelectChanged = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(value);
    onSelected(value);
  };

  return (
    <TextField
      select
      size="small"
      label="Select issue"
      value={selectedValue}
      onChange={onSelectChanged}
      error={error}
    >
      <MenuItem key={defaultIssueValue} value={defaultIssueValue}>
        -
      </MenuItem>
      {displayIssues.map(({ id, name }) => (
        <MenuItem key={id} value={id}>
          {name}
        </MenuItem>
      ))}
    </TextField>
  );
}

export const defaultIssueValue = "999";
