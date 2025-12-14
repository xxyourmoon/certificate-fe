"use client";

import { updateEventSchema } from "@/lib/types/General";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { DatePickerFormField } from "./fields/CustomDatePickerField";
import { InputFormField } from "./fields/CustomInputField";
import { SelectFormField } from "./fields/CustomSelectField";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { IEventData, IEventParticipantCertificate } from "@/lib/types/Event";
import { updateEvent } from "@/actions/mutation/events/updateEvent";
import LoadingCircle from "../animation/LoadingCircle";
import GeneralDialog from "../popup/GeneralDialog";
import { TechnologyDesign1Template } from "../template/TechnologyDesign1Template";
import { TechnologyDesign2Template } from "../template/TechnologyDesign2Template";
import { TechnologyDesign3Template } from "../template/TechnologyDesign3Template";
import { FormalDesign1Template } from "../template/FormalDesign1Template";
import { FormalDesign2Template } from "../template/FormalDesign2Template";
import { FormalDesign3Template } from "../template/FormalDesign3Template";
import { SemnastiDesignTemplate } from "../template/SemnastiDesignTemplate";

const templateOptions = [
  { value: "DEFAULTDESIGN", label: "Default Design" },
  { value: "TECHNOLOGYDESIGN_1", label: "Technology Design 1" },
  { value: "TECHNOLOGYDESIGN_2", label: "Technology Design 2" },
  { value: "TECHNOLOGYDESIGN_3", label: "Technology Design 3" },
  { value: "FORMALDESIGN_1", label: "Formal Design 1" },
  { value: "FORMALDESIGN_2", label: "Formal Design 2" },
  { value: "FORMALDESIGN_3", label: "Formal Design 3" },
  { value: "SEMNASTIDESIGN", label: "SEMNASTI Design" },
];

interface Props {
  eventData: IEventData;
}

const UpdateEventForm = ({ eventData }: Props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openTemplateDialog, setOpenTemplateDialog] = useState<boolean>(false);
  const form = useForm<z.infer<typeof updateEventSchema>>({
    resolver: zodResolver(updateEventSchema),
    defaultValues: {
      eventName: eventData.eventName,
      description: eventData.description,
      activityAt: eventData.activityAt,
      prefixCode: eventData.prefixCode,
      suffixCode: eventData.suffixCode.toString(),
      organizer: eventData.organizer,
      eventTheme: eventData.eventTheme,
      eventTemplate: eventData.eventTemplate,
    },
  });
  const [participantCertificateData, setParticipantCertificateData] =
    useState<IEventParticipantCertificate>({
      eventName: eventData.eventName || "Name of the event",
      eventDescription: eventData.description || "Description of the event",
      activityAt: eventData.activityAt || "Activity at the event",
      eventTemplate: eventData.eventTemplate || "Template of the event",
      eventTheme: eventData.eventTheme || "Theme of the event",
      organizer: eventData.organizer || "Organizer of the event",
      logoFirst: eventData.logoFirstPath || null,
      logoSecond: eventData.logoSecondPath || null,
      name: null,
      email: null,
      position: null,
      addedAt: null,
      certificateNumber: `${eventData.prefixCode}${eventData.suffixCode}`,
      stakeholders: {
        name: eventData.stakeholders![0].name || "Name of the stakeholder",
        position:
          eventData.stakeholders![0].position || "Position of the stakeholder",
        photoPath: eventData.stakeholders![0].photoPath,
      },
      qrCodes: null,
    });

  const previewHandler = async (values: z.infer<typeof updateEventSchema>) => {
    setParticipantCertificateData({
      eventName: values.eventName || "Name of the event",
      eventDescription: values.description || "Description of the event",
      activityAt: values.activityAt || "Activity at the event",
      eventTemplate: values.eventTemplate || "Template of the event",
      eventTheme: values.eventTheme || "Theme of the event",
      organizer: values.organizer || "Organizer of the event",
      logoFirst: eventData.logoFirstPath || null,
      logoSecond: eventData.logoSecondPath || null,
      name: null,
      email: null,
      position: null,
      addedAt: null,
      certificateNumber: `${values.prefixCode}/`,
      stakeholders: {
        name: eventData.stakeholders![0].name || "Name of the stakeholder",
        position:
          eventData.stakeholders![0].position || "Position of the stakeholder",
        photoPath: eventData.stakeholders![0].photoPath,
      },
      qrCodes: null,
    });
    setOpenTemplateDialog(true);
  };

  const submitHandler = async (values: z.infer<typeof updateEventSchema>) => {
    setIsLoading(true);
    try {
      toast.promise(updateEvent(values, eventData.uid), {
        loading: "Updating event...",
        success: (data) => {
          if (data.success) {
            router.push(`/events/${eventData.uid}`);
            return "Event updated successfully!";
          }
          throw new Error(data.message as string);
        },
        error: (error) => {
          return error.message;
        },
        finally: () => {
          setIsLoading(false);
        },
      });
    } catch (error) {
      console.error("Error updating event: ", error);
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(previewHandler)}>
        <div className="mt-4 grid w-full grid-cols-1 md:grid-cols-2 gap-4">
          <InputFormField
            form={form}
            name="eventName"
            label="Event Name"
            description="The name of your event"
            placeholder="SEMNASTI 2024"
          />
          <InputFormField
            form={form}
            name="description"
            label="Event Description"
            description="Provide a brief description of your event"
            placeholder="SEMINAR NASIONAL TEKNOLOGI INFORMASI 2024"
          />
          <DatePickerFormField
            form={form}
            name="activityAt"
            label="Event Date"
            description="Activity date of your event"
          />
          <InputFormField
            form={form}
            name="prefixCode"
            label="Event Certificate Prefix Code"
            description="Starting Serial of your certificate"
            placeholder="001/HMTI/SEMNASTI/XI/2024"
          />
          <InputFormField
            form={form}
            name="suffixCode"
            label="Event Certificate Suffix Code"
            description="The starting number for the certificate suffix"
            placeholder="1"
            type="number"
          />
          <InputFormField
            form={form}
            name="organizer"
            label="Event Organizer"
            description="Name a organizer for your event"
            placeholder="Himpunan Mahasiswa Teknik Informatika"
          />
          <InputFormField
            form={form}
            name="eventTheme"
            label="Event Theme"
            description="Name a theme for your event"
            placeholder="Technology"
          />
          <SelectFormField
            form={form}
            name="eventTemplate"
            label="Event Template"
            description="Choose a template for your event certificate"
            placeholder="Select a certificate theme"
            options={templateOptions}
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="md:col-span-2 min-h-10 mt-4 w-full bordered hover:bg-purplee/90 border-b-4 bg-purplee hover:border-b-1 text-black"
          >
            {isLoading ? (
              <div>
                <LoadingCircle />
                <span className="ml-2">updating...</span>
              </div>
            ) : (
              "preview event"
            )}
          </Button>
        </div>
        <GeneralDialog
          open={openTemplateDialog}
          setOpen={setOpenTemplateDialog}
          title="Template Preview"
          message="Preview the template before updating the event."
          onSuccess={() => {
            setOpenTemplateDialog(false);
            form.handleSubmit(submitHandler)();
          }}
          successText="update event"
        >
          {participantCertificateData !== null ||
          participantCertificateData !== undefined ? (
            participantCertificateData.eventTemplate === "DEFAULTDESIGN" ? (
              ""
            ) : participantCertificateData.eventTemplate ===
              "SEMNASTIDESIGN" ? (
              <div className="flex flex-col items-center justify-center">
                <SemnastiDesignTemplate
                  participantCertificateData={participantCertificateData}
                  mode="CREATE/EDIT"
                />
              </div>
            ) : participantCertificateData.eventTemplate ===
              "FORMALDESIGN_1" ? (
              <div className="flex flex-col items-center justify-center">
                <FormalDesign1Template
                  participantCertificateData={participantCertificateData}
                  mode="CREATE/EDIT"
                />
              </div>
            ) : participantCertificateData.eventTemplate ===
              "FORMALDESIGN_2" ? (
              <div className="flex flex-col items-center justify-center">
                <FormalDesign2Template
                  participantCertificateData={participantCertificateData}
                  mode="CREATE/EDIT"
                />
              </div>
            ) : participantCertificateData.eventTemplate ===
              "FORMALDESIGN_3" ? (
              <div className="flex flex-col items-center justify-center">
                <FormalDesign3Template
                  participantCertificateData={participantCertificateData}
                  mode="CREATE/EDIT"
                />
              </div>
            ) : participantCertificateData.eventTemplate ===
              "TECHNOLOGYDESIGN_1" ? (
              <div className="flex flex-col items-center justify-center">
                <TechnologyDesign1Template
                  mode="CREATE/EDIT"
                  participantCertificateData={participantCertificateData}
                />
              </div>
            ) : participantCertificateData.eventTemplate ===
              "TECHNOLOGYDESIGN_2" ? (
              <div className="flex flex-col items-center justify-center">
                <TechnologyDesign2Template
                  participantCertificateData={participantCertificateData}
                  mode="CREATE/EDIT"
                />
              </div>
            ) : participantCertificateData.eventTemplate ===
              "TECHNOLOGYDESIGN_3" ? (
              <div className="flex flex-col items-center justify-center">
                <TechnologyDesign3Template
                  participantCertificateData={participantCertificateData}
                  mode="CREATE/EDIT"
                />
              </div>
            ) : null
          ) : null}
        </GeneralDialog>
      </form>
    </Form>
  );
};

export default UpdateEventForm;
