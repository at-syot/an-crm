import { Container, Link, Stack, Typography } from "@mui/material";
import { useAtom } from "jotai";
import { loggedInUserAtom, renderingAdminPageAtom } from "../../states";
import { useState } from "react";
import type { RenderingAdminPageAtomValue } from "../../states";
import AdminUsers from "../AdminUsers";

// TODO: usecase - admin logout
// - get current token
// - all api/admins/logout

// TODO: UI
// UI & Feature: render admin page by user roles
// UI & Feature: regist new admin
// UI & Feature: view & edit adminUser page

export default function Admin() {
  const [renderingAdminPage] = useAtom(renderingAdminPageAtom);
  const [loggedInUser] = useAtom(loggedInUserAtom);
  const onLogoutClick = () => {
    console.log("loggedInUser", loggedInUser);
  };

  const Content = () => {
    if (renderingAdminPage == "Admins") return <AdminUsers />;
    return <>constructing</>;
  };
  return (
    <Container>
      <Stack
        direction={"row"}
        alignItems={"center"}
        gap={2}
        justifyContent={"end"}
        marginTop={8}
        borderBottom={1}
        borderColor={"GrayText"}
      >
        <Typography>Login as: {loggedInUser?.username}</Typography>
        <Link onClick={onLogoutClick}>Logout</Link>
      </Stack>
      <Stack direction={"row"}>
        <SidebarMenus />
        <Content />
      </Stack>
    </Container>
  );
}

type SidebarMenuLabel = RenderingAdminPageAtomValue;
type SidebarMenu = Record<SidebarMenuLabel, { active: boolean }>;
const initMenus: SidebarMenu = {
  Tickets: { active: false },
  Admins: { active: false },
  Clients: { active: false },
};
function SidebarMenus() {
  const [, setRenderingAdminPage] = useAtom(renderingAdminPageAtom);
  const [menus, setMenus] = useState<SidebarMenu>(initMenus);
  const sx = (active: boolean) => {
    return {
      cursor: "pointer",
      "&:hover": { color: "rgb(166, 165, 164)" },
      textDecoration: active ? "underline" : "none",
    };
  };

  return (
    <Stack
      direction={"column"}
      width={"20%"}
      maxWidth={"150px"}
      gap={1}
      paddingTop={"1rem"}
    >
      {Object.entries(menus).map(([title, v], i) => {
        return (
          <Typography
            key={i}
            sx={sx(v.active)}
            onClick={() => {
              if (v.active) return;
              setMenus({ ...initMenus, [title]: { active: !v.active } });
              setRenderingAdminPage(title as SidebarMenuLabel);
            }}
          >
            {title}
          </Typography>
        );
      })}
    </Stack>
  );
}
