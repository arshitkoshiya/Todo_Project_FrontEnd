import axios from "axios";
import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import { Avatar, Grid, Typography, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
//---------------------------------------------
import Modal from "@mui/material/Modal";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import "./index.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import CreateTask from "../../CreateTask";

const MySwal = withReactContent(Swal);
interface AllTaskProps {
  data?: string;
  view?: string;
}

const AllTasks: React.FC<AllTaskProps> = (props: any) => {
  const [allTasks, setAllTasks] = useState<any>([]);
  const [eachTasks, setEachTasks] = useState<any>("");
  const [type, setType] = useState<string>("Edit");
  const userId = localStorage.getItem("data");
  const TaskUrl = "http://10.37.55.112:5000/tasks";

  const getTasks = async () => {
    await axios
      ?.get(TaskUrl)
      .then((response: any) => {
        setAllTasks(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //------------------------------------------------------

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.primary.dark,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  //-----------------------------------------------

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "#fff", // Use the desired background color
    color: "#000", // Set the text color to white or your desired text color
    // border: "2px solid #000",
    p: 4,
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = async (id: any) => {
    await axios
      ?.get(TaskUrl)
      .then((response: any) => {
        console.log(response.data.filter((task: any) => task.TaskId === id));
        setEachTasks(
          response.data.filter((task: any) => task.TaskId === id)[0]
        );
      })
      .catch((error) => {
        console.log(error);
      });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleDelete = async (id: any, data: any) => {
    const DeleteURL = "http://10.37.55.112:5000/tasks/deleteTask";
    await axios
      ?.delete(DeleteURL, {
        data: { Id: id },
      })
      .then((response: any) => {
        MySwal.fire({
          title: "Delete Confirmation",
          text: `Are you sure you want to delete ${data}?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, delete it",
          cancelButtonText: "Cancel",
        }).then((result) => {
          if (result.isConfirmed) {
            getTasks();
          }
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleEdit = (id: any) => {
    return <CreateTask type={type} id={id} />;
  };

  useEffect(() => {
    getTasks();
  }, [props.data]);

  return (
    <>
      {props.view === "list" ? (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead className="header_container">
              <TableRow>
                <StyledTableCell>Task Name</StyledTableCell>
                <StyledTableCell>Task Description</StyledTableCell>
                <StyledTableCell>Last Date</StyledTableCell>
                <StyledTableCell>Created Date</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
                <StyledTableCell>Assigned By</StyledTableCell>
                <StyledTableCell>Priority</StyledTableCell>
                <StyledTableCell>Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allTasks
                .map((data: any) => (
                  <StyledTableRow key={data.TaskTitle}>
                    <StyledTableCell component="th" scope="row">
                      {data.TaskTitle}
                    </StyledTableCell>
                    <StyledTableCell>{data.TaskDescription}</StyledTableCell>
                    <StyledTableCell>{data.LastDate}</StyledTableCell>
                    <StyledTableCell>{data.CreatedDate}</StyledTableCell>
                    <StyledTableCell>{data.Status}</StyledTableCell>
                    <StyledTableCell>
                      <Avatar
                        sx={{ bgcolor: data.color, width: 27, height: 27 }}
                      >
                        {data.username.slice(0, 1).toUpperCase()}
                      </Avatar>
                    </StyledTableCell>
                    <StyledTableCell>
                      {data.Priority === "High" ? (
                        <KeyboardDoubleArrowUpIcon sx={{ color: "red" }} />
                      ) : data.Priority === "Low" ? (
                        <KeyboardDoubleArrowDownIcon sx={{ color: "Green" }} />
                      ) : (
                        <UnfoldMoreIcon sx={{ color: "orange" }} />
                      )}
                    </StyledTableCell>
                    <StyledTableCell className="action">
                      <DeleteOutlineOutlinedIcon
                        sx={{
                          color: "red",
                          cursor: "pointer",
                          visibility: `
                          ${
                            data.Status === "New" ||
                            (data.Status === "Pending" &&
                              data.UserId == userId) ||
                            userId == data.AssignedTo
                              ? "visible"
                              : "hidden"
                          }
                        `,
                        }}
                        titleAccess="Delete"
                        onClick={() =>
                          handleDelete(data.TaskId, data.TaskTitle)
                        }
                      />
                      <EditOutlinedIcon
                        onClick={() => {
                          handleEdit(data.TaskId);
                        }}
                        sx={{
                          color: "#1976d2",
                          cursor: "pointer",
                          visibility: `
                          ${
                            data.Status === "New" ||
                            (data.Status === "Pending" && data.UserId == userId)
                              ? "visible"
                              : "hidden"
                          }
                        `,
                        }}
                        titleAccess="Edit"
                      />
                      <VisibilityIcon
                        sx={{ color: "gray", cursor: "pointer" }}
                        titleAccess="View"
                        onClick={() => handleOpen(data.TaskId)}
                      />
                    </StyledTableCell>
                    <Modal
                      BackdropProps={{
                        style: { backgroundColor: "#00000066", opacity: 0.1 }, // Adjust the alpha (last) value for transparency
                      }}
                      open={open}
                      onClose={handleClose}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                    >
                      <Box sx={style}>
                        <Typography
                          id="modal-modal-title"
                          variant="h6"
                          component="h2"
                        >
                          {eachTasks.TaskTitle}
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                          {eachTasks.Status}
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                          {eachTasks.LastDate}
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                          {eachTasks.CreatedDate}
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                          {eachTasks.Priority}
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                          {eachTasks.TaskDescription}
                        </Typography>
                      </Box>
                    </Modal>
                  </StyledTableRow>
                ))
                .reverse()}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Grid container spacing={2} className="all_card">
          {allTasks
            ?.map((task: any, index: any) => {
              return (
                <Grid item xs={12} sm={6} md={4}>
                  <Card className="tasks" sx={{ maxWidth: 400 }} key={index}>
                    <CardContent>
                      <Typography variant="h5" component="div">
                        {task.TaskTitle}
                      </Typography>
                      <Typography component="div">
                        {task.TaskDescription}
                      </Typography>
                      <Typography component="div">{task.LastDate}</Typography>
                      <Typography component="div">
                        {task.CreatedDate}
                      </Typography>
                      <Typography component="div">{task.Status}</Typography>
                      <Typography component="div">
                        <Avatar
                          sx={{ bgcolor: task.color, width: 27, height: 27 }}
                        >
                          {task.username.slice(0, 1).toUpperCase()}
                        </Avatar>
                      </Typography>
                      <Typography component="div">
                        {task.Priority === "High" ? (
                          <KeyboardDoubleArrowUpIcon sx={{ color: "red" }} />
                        ) : task.Priority === "Low" ? (
                          <KeyboardDoubleArrowDownIcon
                            sx={{ color: "Green" }}
                          />
                        ) : (
                          <UnfoldMoreIcon sx={{ color: "orange" }} />
                        )}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small">Edit</Button>
                      <Button size="small">Delete</Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })
            .reverse()}
        </Grid>
      )}
    </>
  );
};

export default AllTasks;
