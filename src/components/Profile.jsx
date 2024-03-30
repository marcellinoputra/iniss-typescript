import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";
import { useNavigate } from "react-router-dom";

const AvatarDemo = () => {
  const [avatarEl, setAvatarEl] = React.useState(null);

  const [invisible, setInvisible] = React.useState(false);

  const handleAvatarClick = (e) => {
    setAvatarEl(e.currentTarget);
  };

  const handleAvatarClose = () => {
    setAvatarEl(null);
  };

  const [notifyEl, setNotifyEl] = React.useState(null);

  const handleBadgeVisibility = () => {
    setInvisible(!invisible);
  };

  const handleNotifyOpen = (e) => {
    setNotifyEl(e.currentTarget);
    if (!invisible) {
      handleBadgeVisibility();
    }
  };

  const handleNotifyClose = () => {
    setNotifyEl(null);
  };
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role_id");
    navigate("/sign-in", { replace: true });
  }

  const open = Boolean(avatarEl);
  const id = open ? "simple-popover" : undefined;

  const notifyOpen = Boolean(notifyEl);
  const notifyId = notifyOpen ? "simple-notify" : undefined;
  return (
    <div>
      <Stack direction="row" spacing={1}>
        <Button aria-describedby={id} onClick={handleAvatarClick}>
          <Avatar>Dio</Avatar>
          <KeyboardArrowDownIcon />
        </Button>
      </Stack>

      <Popover
        id={id}
        open={open}
        anchorEl={avatarEl}
        onClose={handleAvatarClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <List disablePadding>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="Setting" />
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem disablePadding>
            <ListItemButton onClick={() => logout()}>
              <ListItemText primary="Log out" />
            </ListItemButton>
          </ListItem>
        </List>
      </Popover>

      <Popover
        id={notifyId}
        open={notifyOpen}
        anchorEl={notifyEl}
        onClose={handleNotifyClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <List disablePadding>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="Avatar" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="Favorites" />
            </ListItemButton>
          </ListItem>
        </List>
      </Popover>
    </div>
  );
};

export default AvatarDemo;
