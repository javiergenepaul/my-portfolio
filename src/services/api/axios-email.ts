import { EmailInterface } from "@/config";
import { axiosInstance } from "../axios-instance";

interface SendEmailInterface {
  data: EmailInterface;
  setLoading: (loading: boolean) => void;
  onSuccess: () => void;
  onError: () => void;
}

export const SendEmail = async (props: SendEmailInterface) => {
  const { data, setLoading, onSuccess, onError } = props;
  setLoading(true);
  try {
    await axiosInstance.post("", data);
    onSuccess();
  } catch {
    onError();
  } finally {
    setLoading(false);
  }
};
