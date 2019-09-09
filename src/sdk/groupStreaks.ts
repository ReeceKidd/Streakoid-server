import axios from "axios";
import { getServiceConfig } from "../getServiceConfig";
const { APPLICATION_URL } = getServiceConfig();

import ApiVersions from "../Server/versions";
import { RouteCategories } from "../routeCategories";
import { SupportedRequestHeaders } from "../Server/headers";
import { optional } from "joi";

const getAll = ({
  creatorId,
  memberId,
  timezone
}: {
  creatorId?: string;
  memberId?: string;
  timezone?: string;
}) => {
  let getAllSoloStreaksURL = `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.groupStreaks}?`;
  if (creatorId) {
    getAllSoloStreaksURL = `${getAllSoloStreaksURL}creatorId=${creatorId}&`;
  }
  if (memberId) {
    getAllSoloStreaksURL = `${getAllSoloStreaksURL}memberId=${memberId}&`;
  }
  if (timezone) {
    getAllSoloStreaksURL = `${getAllSoloStreaksURL}timezone=${timezone}`;
  }
  return axios.get(getAllSoloStreaksURL);
};

const getOne = (groupStreakId: string) => {
  return axios.get(
    `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.groupStreaks}/${groupStreakId}`
  );
};

const create = ({
  creatorId,
  streakName,
  timezone,
  streakDescription,
  numberOfMinutes,
  members
}: {
  creatorId: string;
  streakName: string;
  timezone: string;
  streakDescription?: string;
  numberOfMinutes?: number;
  members?: string[];
}) => {
  return axios.post(
    `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.groupStreaks}`,
    { creatorId, streakName, streakDescription, numberOfMinutes, members },
    { headers: { [SupportedRequestHeaders.xTimezone]: timezone } }
  );
};

const deleteOne = (groupStreakId: string) => {
  return axios.delete(
    `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.groupStreaks}/${groupStreakId}`
  );
};

const groupStreaks = {
  getAll,
  getOne,
  create,
  deleteOne
};

export default groupStreaks;
