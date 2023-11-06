import * as React from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PostAddIcon from "@mui/icons-material/PostAdd";

import { Link, Outlet } from "react-router-dom";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import ChecklistIcon from "@mui/icons-material/Checklist";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ListAltIcon from "@mui/icons-material/ListAlt";
import "./index.css";
import Logo from "../../Images/Logo.jpeg";
//------------------------------------
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { Avatar, AvatarGroup } from "@mui/material";
import axios from "axios";

const drawerWidth = 240;
const UserURL = "http://10.37.55.112:5000/users";
const userData = localStorage.getItem("userData");
const color = localStorage.getItem("color");
const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function MiniDrawer(props : any) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [urlData, setUrlData] = React.useState("Your Task");
  const [allUser, setAllUser] = React.useState([]);
  const [navLink, setNavLink] = React.useState("Your Task");
  //-----------------------------------------------


  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    nextView: string
  ) => {
    props.list(nextView);
  };

  const alluser = async () => {
    await axios
      ?.get(UserURL)
      .then((response: any) => {
        setAllUser(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handledUrlData = (text: any) => {
    setUrlData(text);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const navData = () => {
    let prefix = "";
    if (["All Task", "All Done", "On Hold", "In Progress"].includes(urlData)) {
      prefix = "All Users / ";
    } else if (
      ["Your Task", "Completed", "Pending", "Open"].includes(urlData)
    ) {
      prefix = "Yours / ";
    }
    setNavLink(`${prefix}${urlData}`);
  };

  React.useEffect(() => {
    navData();
  }, [urlData]);
  React.useEffect(() => {
    alluser();
  }, []);

  const icons: any = {
    "Your Task": <ChecklistIcon color="primary" />,
    Completed: <TaskAltIcon color="success" />,
    Pending: <PendingActionsIcon color="primary" />,
    Open: <AccessTimeIcon sx={{ color: "orangered" }} />,
    "All Task": <ListAltIcon color="primary" />,
    "All Done": <TaskAltIcon color="success" />,
    "On Hold": <PendingActionsIcon color="primary" />,
    "In Progress": <AccessTimeIcon sx={{ color: "orangered" }} />,
    ...(userData
      ? {
          Profile: (
            <Avatar
              alt={userData.slice(0, 1).toUpperCase()}
              src={userData.slice(0, 1).toUpperCase()}
              sx={{ bgcolor: `${color}`, width: 28, height: 28 }}
            />
          ),
        }
      : {}),
    "Create Task": <PostAddIcon color="primary" />,
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            className="nevigation"
          >
            {navLink}
            <div className="allusers">
              <AvatarGroup total={allUser.length}>
                {allUser?.slice(0, 3).map((data: any, index: any) => (
                  <Avatar
                    key={index}
                    alt={data.username.slice(0, 1).toUpperCase()}
                    src={data.username.slice(0, 1).toUpperCase()}
                    sx={{ backgroundColor: data.color, width: 40, height: 40 }}
                  />
                ))}
              </AvatarGroup>

              <ToggleButtonGroup
                orientation="horizontal"
                value={props.view}
                exclusive
                onChange={handleChange}
              >
                <ToggleButton value="list" aria-label="list">
                  <ViewListIcon sx={{ color: "white" }} />
                </ToggleButton>
                <ToggleButton value="module" aria-label="module">
                  <ViewModuleIcon sx={{ color: "white" }} />
                </ToggleButton>
              </ToggleButtonGroup>
            </div>
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader sx={{ width: "100%" }}>
          <img src={Logo} alt="" className="logo" />
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon sx={{ color: "#1976d2" }} />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />

        <List>
          {["Your Task", "Pending", "Open", "Completed"].map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: "block" }}>
              <Link
                to={`/${text}`}
                style={{
                  outline: "none",
                  textDecoration: "none",
                  color: "#1976d2",
                }}
                onClick={() => {
                  handledUrlData(text);
                }}
              >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: "#1976d2",
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    {icons[text]}
                  </ListItemIcon>
                  <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>

        <Divider />
        <List>
          {["All Task", "On Hold", "In Progress", "All Done"].map(
            (text, index) => (
              <ListItem key={text} disablePadding sx={{ display: "block" }}>
                <Link
                  to={`/${text}`}
                  style={{
                    outline: "none",
                    textDecoration: "none",
                    color: "#1976d2",
                  }}
                  onClick={() => {
                    handledUrlData(text);
                  }}
                >
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      {icons[text]}
                    </ListItemIcon>
                    <ListItemText
                      primary={text}
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                </Link>
              </ListItem>
            )
          )}
        </List>
        <Divider />
        <List>
          {["Create Task", "Profile"].map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: "block" }}>
              <Link
                to={`/${text}`}
                style={{
                  outline: "none",
                  textDecoration: "none",
                  color: "#1976d2",
                }}
                onClick={() => {
                  handledUrlData(text);
                }}
              >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    {icons[text]}
                  </ListItemIcon>
                  <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Typography paragraph>
          {/* {(() => {
            switch (urlData) {
              case "Create Task":
                return <CreateTask />;
              case "Your Task":
                return <Tasks data={urlData} view={view} />;
              case "Completed":
                return <CompletedTask view={view} data={urlData} />;
              case "Pending":
                return <Pending view={view} data={urlData} />;
              case "Open":
                return <InProgress view={view} data={urlData} />;
              case "All Task":
                return <AllTasks data={urlData} view={view} />;
              case "All Done":
                return <AllCompletedTask view={view} data={urlData} />;
              case "On Hold":
                return <AllPending view={view} data={urlData} />;
              case "In Progress":
                return <AllInProgress view={view} data={urlData} />;
              case "Profile":
                return <Profile />;
              default:
                return <Tasks view={view} />;
            }
          })()} */}
          <Outlet />
        </Typography>
      </Box>
    </Box>
  );
}
