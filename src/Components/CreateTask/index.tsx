import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import "./index.css";
import { Divider, FormControl, InputLabel } from "@mui/material";
import axios from "axios";
// import DatePicker from "@mui/lab";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

interface CreateTaskProps {
  id?: any;
  type?: any;
  data?: string;
  view?: string;
}

const MySwal = withReactContent(Swal);

const CreateTask: React.FC<CreateTaskProps> = (props: any) => {
  const [activeStep, setActiveStep] = React.useState(0);
  const userId: any = localStorage.getItem("data");

  const [dataFromChild, setDataFromChild] = useState<any>({});

  const TaskURL = "http://10.37.55.112:5000/tasks/createTask";

  // Callback function to receive data from the child
  const receiveDataFromChild = (data: any) => {
    setDataFromChild(data);
  };

  const createTask = async () => {
    await axios
      ?.post(TaskURL, {
        taskTitle: dataFromChild.taskTitle,
        taskDescription: dataFromChild.taskDescription,
        Priority: dataFromChild.priority,
        LastDate: dataFromChild.deadLine,
        UserId: parseInt(userId),
        AssignedTo: dataFromChild.user,
        Status: "New",
      })
      .then((response: any) => {
        MySwal.fire({
          title: <strong>Greate</strong>,
          html: <i>Task Created Successfully </i>,
          icon: "success",
        }).then(() => {
          window.location.href = "/All Task";
          return;
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //------------------------------------------------------------------
  const type: string = props;
  const steps = [
    props.type == "Edit" ? "Edit Task Details" : "Fill The Task Details",
    "Preview Details",
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: {
            optional?: React.ReactNode;
          } = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <br />
      <Divider />
      <React.Fragment>
        <Typography sx={{ mt: 2, mb: 1 }}>
          <Create
            activeStep={activeStep}
            receiveDataFromChild={receiveDataFromChild}
          />
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            <ArrowBackIosNewOutlinedIcon titleAccess="Back" />
          </Button>
          <Box sx={{ flex: "1 1 auto" }} />
          {activeStep === steps.length - 1 && (
            <Button
              onClick={() => {
                createTask();
              }}
            >
              Finish
            </Button>
          )}
          {activeStep !== steps.length - 1 && activeStep < 1 && (
            <Button onClick={handleNext}>
              <ArrowForwardIosOutlinedIcon titleAccess="Next" />
            </Button>
          )}
        </Box>
      </React.Fragment>
    </Box>
  );
};
export default CreateTask;

//----------------------------------------------------

const Create = (props: any) => {
  // const [startDate, setStartDate] = useState(new Date());
  const [data, setData] = useState<any>({
    taskTitle: "",
    taskDescription: "",
    priority: "",
    deadLine: "",
    user: "",
  });
  const [users, setUsers] = useState([]);

  const handleValue = (e: any) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const UserURL = "http://10.37.55.112:5000/users";

  const sendDataToParent = () => {
    // Call the callback function with the data
    props.receiveDataFromChild(data);
  };

  const getUser = async () => {
    await axios
      ?.get(UserURL)
      .then((response: any) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getUser();
  }, [props.activeStep == 0]);

  useEffect(() => {
    sendDataToParent();
  }, [props.activeStep == 1]);

  return (
    <>
      {props.activeStep == 0 ? (
        <form className="formContainer">
          <label>Task Title</label>
          <TextField
            required
            name="taskTitle"
            sx={{ height: "50px" }}
            label="Task Title"
            value={data.taskTitle}
            onChange={(e: any) => handleValue(e)}
            fullWidth
          />
          <label>Task Description</label>
          <TextareaAutosize
            required
            name="taskDescription"
            placeholder="Task Description (max 60 words)"
            value={data.taskDescription}
            onChange={(e: any) => handleValue(e)}
            minRows={4}
            maxRows={4}
            style={{ width: "100%" }}
          />
          <label>DeadLine</label>
          <TextField
            required
            name="deadLine"
            sx={{ height: "50px" }}
            label="DeadLine"
            value={data.deadLine}
            onChange={(e: any) => handleValue(e)}
            fullWidth
          />
          <label>Priority</label>
          <FormControl fullWidth>
            <InputLabel id="priority-label">Priority</InputLabel>
            <Select
              name="priority"
              required
              sx={{ height: "50px" }}
              labelId="priority-label"
              label="Priority"
              value={data.priority}
              onChange={(e: any) => handleValue(e)}
            >
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </Select>
          </FormControl>
          <label>Assigned To</label>
          <FormControl fullWidth>
            <InputLabel id="priority-label">Users</InputLabel>
            <Select
              required
              name="user"
              sx={{ height: "50px" }}
              labelId="priority-label"
              label="Priority"
              value={data.user}
              onChange={(e: any) => handleValue(e)}
            >
              <MenuItem value="Select Priority" disabled>
                Select User
              </MenuItem>
              {users.map((data: any, index: any) => (
                <MenuItem key={index} value={data.userId}>
                  {data.username}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </form>
      ) : (
        <div className="preview">
          <label>Task Title : {data.taskTitle}</label>

          <label>Task Description : {data.taskDescription}</label>

          <label>DeadLine : {data.deadLine}</label>

          <label>Priority : {data.priority}</label>

          <label>Assigned User : {data.user}</label>
        </div>
      )}
    </>
  );
};
