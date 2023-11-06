import axios from "axios";
import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import { Avatar, Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
//---------------------------------------------
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

interface CompletedTaskProps {
  data?: string;
  view?: string;
}

const CompletedTask: React.FC<CompletedTaskProps> = (props: any) => {
  const [allTasks, setAllTasks] = useState<any>([]);
  const userId = localStorage.getItem("data");
  const TaskURL = `http://10.37.55.112:5000/tasks?UserId=${userId}`;

  const getTasks = async () => {
    await axios
      ?.get(TaskURL)
      .then((response: any) => {
        setAllTasks(
          response.data.filter((task: any) => task.Status === "Completed")
        );
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

  useEffect(() => {
    getTasks();
  }, [props]);

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
                <StyledTableCell>Assigned By</StyledTableCell>
                <StyledTableCell>Priority</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allTasks.map((data: any) => (
                <StyledTableRow key={data.TaskTitle}>
                  <StyledTableCell component="th" scope="row">
                    {data.TaskTitle}
                  </StyledTableCell>
                  <StyledTableCell>{data.TaskDescription}</StyledTableCell>
                  <StyledTableCell>{data.LastDate}</StyledTableCell>
                  <StyledTableCell>{data.CreatedDate}</StyledTableCell>
                  <StyledTableCell>
                    <Avatar sx={{ bgcolor: data.color, width: 27, height: 27 }}>
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
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Grid container spacing={2} className="all_card">
          {allTasks?.map((task: any, index: any) => {
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
                    <Typography component="div">{task.CreatedDate}</Typography>
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
                        <KeyboardDoubleArrowDownIcon sx={{ color: "Green" }} />
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
          })}
        </Grid>
      )}
    </>
  );
}

export default CompletedTask;
