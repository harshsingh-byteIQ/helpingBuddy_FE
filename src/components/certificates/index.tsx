import CustomTabs from "../customComponents/customTabs";
import styles from "./certificates.module.scss";

const OverAllTab = () => {
  return (
    <div className={styles.OverallWrapper}>
      <p>Your Achievements at a Glance</p>
      <div className={styles.OverAllContent}>
        <p>📌 Total Volunteering Hours: 151 hours</p>
        <p>🎖️ Total Certificates Earned: 14</p>
        <p>⭐ Points Earned: 632</p>
        <p>🎓 Your Rank: [Gold / Silver / Bronze / Contributor]</p>
      </div>
    </div>
  );
};

const Certis = () => {
  return (
    <div className={styles.CertiWrapper}>
      <p>Your Certificates</p>
      <div className={styles.certiContent}>
        <p>
          {" "}
          Your Certificates Here are the certificates you’ve earned for your
          dedication and efforts. You can download them anytime!
        </p>
        <p>[Certificate Name] </p>
        <p>Issued on: [DD/MM/YYYY]</p>
        <p>Issued by: [Organization Name]  [Download PDF] </p>
        <p>[Certificate Name] </p>
        <p>Issued on: [DD/MM/YYYY]</p>
        <p>Issued by: [Organization Name]  [Download PDF] </p>
      </div>
      <h4> Keep volunteering to earn more certificates!</h4>
    </div>
  );
};

const Points = () => {
  return (
    <div className={styles.CertiWrapper}>
      <p>Points Breakdown</p>
      <div className={styles.PointsContent}>
        <p>
          Completed Conversations: +[XX] points  Listening & Support Hours:
          +[XX] points  Community Engagement: +[XX] points  Referrals: +[XX]
          points
        </p>
        <p>Issued by: [Organization Name]  [Download PDF] </p>
        <p>
          {" "}
          Next Milestone: Earn [XX] more points to unlock [Next Level Badge]!{" "}
        </p>
      </div>
      <h4>
        Your points are calculated based on the impact your conversations and
        volunteer work.
      </h4>
    </div>
  );
};

const Certificates = () => {
  return (
    <div className={`container_margin`}>
      <div className={styles.wrapper}>
        <div className={styles.headers}>
          <h3>Certificates & Points Dashboard</h3>
        </div>
        <div className={styles.content}>
          <p>Welcome user !!</p>
          <p>
            Your contributions are making a difference! Here’s a summary of your
            earned certificates and points.
          </p>
        </div>
        <div className={styles.tabsCol}>
          <CustomTabs
            tabs={[
              {
                label: "OverAll Performance",
                content: <OverAllTab></OverAllTab>,
              },
              { label: "certificates", content: <Certis></Certis> },
              { label: "Points", content: <Points></Points> },
            ]}
          ></CustomTabs>
        </div>
        <div>
          <p> Keep Growing!</p>
          <p>
            Want to make a bigger impact? Join special mentorship programs and
            help more people.  Upcoming Volunteering Events: [View
            Opportunities] Your efforts matter. Keep making a difference! ❤️
          </p>
        </div>
      </div>
    </div>
  );
};

export default Certificates;
