import { Form } from "@/components/ui/form";
import { GeneralSheet } from "../GeneralSheet";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { uploadEventLogoFormSchema } from "@/lib/types/General";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileUploadField } from "@/components/forms/fields/CustomFileUpload";
import { Button } from "@/components/ui/button";
import GeneralDialog from "@/components/popup/GeneralDialog";
import { TechnologyDesign1Template } from "@/components/template/TechnologyDesign1Template";
import { useEffect, useState } from "react";
import { IEventData, IEventParticipantCertificate } from "@/lib/types/Event";
import { toast } from "sonner";
import { uploadEventLogo } from "@/actions/mutation/events/uploadEventLogo";
import { TechnologyDesign2Template } from "@/components/template/TechnologyDesign2Template";
import { Crop, Trash2 } from "lucide-react";
import { FormalDesign1Template } from "@/components/template/FormalDesign1Template";
import { FormalDesign2Template } from "@/components/template/FormalDesign2Template";
import { FormalDesign3Template } from "@/components/template/FormalDesign3Template";
import { SemnastiDesignTemplate } from "@/components/template/SemnastiDesignTemplate";

type Props = {
  open: boolean;
  setOpen: (value: boolean) => void;
  eventData: IEventData;
};
export const UploadLogoSheet = ({ open, setOpen, eventData }: Props) => {
  const [openTemplateDialog, setOpenTemplateDialog] = useState<boolean>(false);

  const uploadEventLogoForm = useForm<
    z.infer<typeof uploadEventLogoFormSchema>
  >({
    resolver: zodResolver(uploadEventLogoFormSchema),
    defaultValues: {
      firstLogo: null,
      secondLogo: null,
    },
  });
  const [participantCertificateData, setParticipantCertificateData] =
    useState<IEventParticipantCertificate>({
      eventName: eventData.eventName || "Name of the event",
      eventDescription: eventData.description || "Description of the event",
      activityAt: eventData.activityAt,
      eventTemplate: eventData.eventTemplate,
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
        photoPath: eventData.stakeholders![0].photoPath || null,
      },
      qrCodes: null,
    });
  const previewHandler = async (
    values: z.infer<typeof uploadEventLogoFormSchema>,
  ) => {
    if (!values.firstLogo && !values.secondLogo) {
      uploadEventLogoForm.setError("firstLogo", {
        message: "Please upload at least one logo.",
      });
      return;
    }
    setParticipantCertificateData({
      eventName: eventData.eventName || "Name of the event",
      eventDescription: eventData.description || "Description of the event",
      activityAt: eventData.activityAt,
      eventTemplate: eventData.eventTemplate,
      eventTheme: eventData.eventTheme || "Theme of the event",
      organizer: eventData.organizer || "Organizer of the event",
      logoFirst: values.firstLogo || eventData.logoFirstPath || null,
      logoSecond: values.secondLogo || eventData.logoSecondPath || null,
      name: null,
      email: null,
      position: null,
      addedAt: null,
      certificateNumber: `${eventData.prefixCode}${eventData.suffixCode}`,
      stakeholders: {
        name: eventData.stakeholders![0].name || "Name of the stakeholder",
        position:
          eventData.stakeholders![0].position || "Position of the stakeholder",
        photoPath: eventData.stakeholders![0].photoPath || null,
      },
      qrCodes: null,
    });
    setOpenTemplateDialog(true);
  };
  const submitHandler = async (
    values: z.infer<typeof uploadEventLogoFormSchema>,
  ) => {
    if (!values.firstLogo && !values.secondLogo) {
      uploadEventLogoForm.setError("firstLogo", {
        message: "Please upload at least one logo.",
      });
      return;
    }
    try {
      if (values.firstLogo) {
        toast.promise(
          uploadEventLogo(values.firstLogo[0], eventData.uid, "first"),
          {
            loading: "Uploading event first logo...",
            success: (data) => {
              if (data.success) {
                return data.message;
              }
              throw new Error(data.message as string);
            },
            error: (error) => {
              console.error("Error uploading event first logo:", error);
              return error.message;
            },
            finally: () => {
              setOpenTemplateDialog(false);
            },
          },
        );
      }
      if (values.secondLogo) {
        toast.promise(
          uploadEventLogo(values.secondLogo[0], eventData.uid, "second"),
          {
            loading: "Uploading event second logo...",
            success: (data) => {
              if (data.success) {
                return data.message;
              }
              throw new Error(data.message as string);
            },
            error: (error) => {
              console.error("Error uploading event second logo:", error);
              return error.message;
            },
            finally: () => {
              setOpenTemplateDialog(false);
            },
          },
        );
      }
    } catch (error) {
      console.error("Error uploading event logo:", error);
      toast.error("Failed to upload event logo");
    } finally {
      setOpenTemplateDialog(false);
      uploadEventLogoForm.reset();
      setOpen(false);
    }
  };
  useEffect(() => {
    if (!open) {
      uploadEventLogoForm.reset({
        firstLogo: null,
        secondLogo: null,
      });
    }
  }, [open, uploadEventLogoForm]);
  return (
    <>
      <GeneralSheet
        title="Upload Event Logo"
        description="Upload the logos for your event"
        open={open}
        setOpen={setOpen}
      >
        <Form {...uploadEventLogoForm}>
          <form
            onSubmit={uploadEventLogoForm.handleSubmit(previewHandler)}
            className="px-4 flex flex-col gap-4"
          >
            <FileUploadField
              form={uploadEventLogoForm}
              name="firstLogo"
              label="First Logo"
              description="Upload the first logo for your event"
              accept="image/*"
            >
              <Button
                type="button"
                variant="outline"
                className="bordered bg-purplee hover:bg-purplee/90 border-b-4 hover:border-b-1 text-black flex-1 mt-[6px]"
                size={"lg"}
              >
                <Crop />
              </Button>
              <Button
                type="button"
                variant="outline"
                className="bordered bg-redd hover:bg-redd/90 border-b-4 hover:border-b-1 text-black flex-1 mt-[6px]"
                size={"lg"}
              >
                <Trash2 />
              </Button>
            </FileUploadField>
            <FileUploadField
              form={uploadEventLogoForm}
              name="secondLogo"
              label="Second Logo"
              description="Upload the second logo for your event"
              accept="image/*"
            >
              <Button
                type="button"
                variant="outline"
                className="bordered bg-purplee hover:bg-purplee/90 border-b-4 hover:border-b-1 text-black flex-1 mt-[6px]"
                size={"lg"}
              >
                <Crop />
              </Button>
              <Button
                type="button"
                variant="outline"
                className="bordered bg-redd hover:bg-redd/90 border-b-4 hover:border-b-1 text-black flex-1 mt-[6px]"
                size={"lg"}
              >
                <Trash2 />
              </Button>
            </FileUploadField>
            <Button
              type="submit"
              className="bordered bg-greenn hover:bg-greenn/90 border-b-4 hover:border-b-1 text-black w-full"
              size={"lg"}
            >
              preview template
            </Button>
          </form>
        </Form>
      </GeneralSheet>
      <GeneralDialog
        open={openTemplateDialog}
        setOpen={setOpenTemplateDialog}
        title="Template Preview"
        message="Preview your event template with the uploaded logos"
        onSuccess={() => {
          setOpenTemplateDialog(false);
          uploadEventLogoForm.handleSubmit(submitHandler)();
        }}
        successText="upload logo"
      >
        {participantCertificateData !== null ? (
          participantCertificateData.eventTemplate === "DEFAULTDESIGN" ? (
            ""
          ) : participantCertificateData.eventTemplate === "SEMNASTIDESIGN" ? (
            <div className="flex flex-col items-center justify-center">
              <SemnastiDesignTemplate
                mode="CREATE/EDIT"
                participantCertificateData={participantCertificateData}
              />
            </div>
          ) : participantCertificateData.eventTemplate === "FORMALDESIGN_1" ? (
            <div className="flex flex-col items-center justify-center">
              <FormalDesign1Template
                mode="CREATE/EDIT"
                participantCertificateData={participantCertificateData}
              />
            </div>
          ) : participantCertificateData.eventTemplate === "FORMALDESIGN_2" ? (
            <div className="flex flex-col items-center justify-center">
              <FormalDesign2Template
                mode="CREATE/EDIT"
                participantCertificateData={participantCertificateData}
              />
            </div>
          ) : participantCertificateData.eventTemplate === "FORMALDESIGN_3" ? (
            <div className="flex flex-col items-center justify-center">
              <FormalDesign3Template
                mode="CREATE/EDIT"
                participantCertificateData={participantCertificateData}
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
                mode="CREATE/EDIT"
                participantCertificateData={participantCertificateData}
              />
            </div>
          ) : participantCertificateData.eventTemplate ===
            "TECHNOLOGYDESIGN_3" ? (
            ""
          ) : null
        ) : null}
      </GeneralDialog>
    </>
  );
};
