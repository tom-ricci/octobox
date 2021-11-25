import React, { FC, ReactElement } from "react";
import { useSleep } from "../hooks/useSleep";
import { Link } from "react-router-dom";

interface Props {

}

const Index: FC<Props> = (): ReactElement => {

  const alertAfterSleep = async (): Promise<void> => {
    await useSleep(2000);
    alert("i slept for 2 seconds, then alearted you that i slept for 2 seconds!");
  };

  return (
    <React.Fragment>
      <h1>Hello world!</h1>
      <button onClick={alertAfterSleep}>Sleep for 2 seconds, then alert the user.</button>
      <br/>
      <Link to={"./some/non/existent/url"}>This will return a 404</Link>
      <Link to={"./dynamic"}>This will go to dynamic</Link>
      <Link to={"./long"}>This will go to long</Link>
      <Link to={"./about"} reloadDocument={true}>This will go to static page</Link>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus eget venenatis ante. Duis sit amet lacus gravida, bibendum mi luctus, feugiat quam. Morbi egestas porttitor pretium. Curabitur elementum dignissim tincidunt. Mauris vitae sagittis erat. Etiam enim mauris, sollicitudin convallis euismod a, hendrerit at mauris. Proin in erat neque.

        Aliquam porta turpis massa, ultricies varius elit rutrum non. In nunc elit, maximus ut lectus ut, eleifend commodo dolor. Donec tempus ac felis et porttitor. Aenean volutpat, arcu at porttitor volutpat, nibh tortor ultricies leo, aliquam blandit leo velit vitae magna. Ut vulputate in elit a pellentesque. Aliquam tempus sem justo, in venenatis lacus scelerisque quis. Vestibulum imperdiet orci nec quam efficitur pretium. Sed vitae est dapibus, imperdiet magna ut, tristique dolor. Mauris sed velit a elit porttitor hendrerit vel ut quam. Nulla cursus tempor enim, et tempus tellus consectetur ut. Aliquam vitae sapien finibus, iaculis magna ut, suscipit magna. Duis euismod leo lacus, sed consequat tortor cursus in. Quisque lacinia, nulla eget scelerisque feugiat, nulla nunc interdum ex, a tempus felis diam sit amet enim. Etiam ornare risus tortor, vitae aliquam sapien maximus quis. Proin ligula mi, bibendum at dolor nec, venenatis accumsan risus.

        Cras sit amet velit augue. Curabitur et nibh ut massa laoreet consectetur. Nullam fermentum, nulla eu suscipit tincidunt, augue ligula pulvinar turpis, ac congue mauris nulla vel dui. Curabitur lorem urna, consectetur vitae est id, dignissim ultrices dui. In hac habitasse platea dictumst. Proin tempus, massa sed aliquam faucibus, erat metus ornare massa, nec rhoncus tortor nibh a diam. Quisque in finibus odio. Sed vehicula aliquet tellus, eu sagittis neque lobortis at. Morbi vel interdum mauris, vel ultrices justo. Proin facilisis nisi nec vulputate vestibulum.

        Proin quis ipsum quam. Cras consequat nisl nunc, fermentum ornare quam congue non. Curabitur mauris nunc, suscipit quis ligula in, dictum dignissim augue. Nunc eget massa ex. Pellentesque neque velit, feugiat vel lectus vitae, posuere feugiat lacus. Ut non pulvinar nibh. Nunc hendrerit mi in massa lacinia, sit amet dignissim felis lacinia. Morbi augue risus, ullamcorper a lacus vitae, aliquam congue ex. Aliquam erat volutpat.

        Praesent et nulla venenatis, convallis metus et, vestibulum mi. Duis in neque eget justo vehicula pharetra vitae nec ligula. Nunc rutrum lacus tristique euismod porta. Sed dapibus dictum nisl ut volutpat. Nam at nibh ultrices, congue eros eu, euismod erat. Etiam tincidunt varius risus a feugiat. Aenean pharetra justo a nulla consequat convallis. Phasellus at quam sollicitudin, consectetur eros in, hendrerit sem. Cras tincidunt mollis nibh a pretium. Etiam facilisis varius est quis mollis. Cras in velit condimentum, posuere ipsum id, consectetur odio.

        Vivamus ac interdum lorem. Morbi a feugiat arcu. Nunc lobortis pellentesque lacus, vitae lacinia turpis cursus ac. Integer id purus quis turpis porta fermentum nec nec neque. Pellentesque dolor urna, facilisis non accumsan ut, placerat eget dolor. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Etiam faucibus ex non erat posuere ornare. Praesent sem sapien, consequat vitae nibh et, porta ullamcorper nulla. Donec ut aliquet neque.

        Nulla nec porta augue. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Morbi odio purus, convallis finibus sagittis vitae, rhoncus sit amet metus. Ut ut leo id dui tristique rhoncus eget vel urna. Maecenas at elit nec erat posuere molestie. Maecenas malesuada lacinia sem a porta. Vivamus varius elit vel placerat pharetra. Pellentesque placerat, magna nec molestie auctor, dolor dui imperdiet tellus, eu egestas augue erat non diam. In faucibus est nec eros egestas imperdiet.

        Phasellus et libero lacus. Curabitur id tortor elit. Morbi vitae turpis a ex auctor pellentesque. Phasellus faucibus sem sed odio porta tempor. Integer et pellentesque libero. Praesent justo neque, eleifend a dolor in, venenatis consequat eros. Fusce mi nunc, finibus vel est eu, ultricies congue risus. Vivamus gravida neque orci, eu congue leo tincidunt quis. Maecenas quis commodo lorem. Sed faucibus porttitor velit, et venenatis ante congue in. Sed ut elementum nulla. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Mauris facilisis luctus tortor non tristique. In tristique maximus risus et congue. Cras porta at urna at ullamcorper. Nulla vulputate aliquam urna, nec venenatis felis scelerisque nec.

        Duis ac neque commodo justo hendrerit malesuada. Nam id dui eros. Sed eleifend egestas rutrum. Etiam ornare vestibulum lacus. Nulla et dictum nulla. Aliquam pellentesque lectus semper neque tincidunt, et aliquet nisi congue. Mauris dapibus sapien ac pretium lobortis. Duis eu enim ac magna commodo placerat. Aliquam laoreet felis sit amet venenatis congue. Suspendisse non tortor ante. Curabitur non pretium elit. Suspendisse in orci nulla. Quisque interdum turpis ipsum, et posuere lectus tincidunt eu.

        Fusce eget maximus nunc. Cras placerat lacus ac nulla posuere maximus. Sed dictum purus vitae ipsum pretium commodo. Mauris commodo, orci eget faucibus commodo, libero ligula convallis risus, non aliquet massa nibh non nulla. Integer condimentum ante a sapien condimentum malesuada. Fusce quis blandit ex, nec sodales mauris. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum sed finibus sapien. Quisque mollis augue eros, et iaculis neque euismod consectetur. Vivamus ex nunc, congue id tristique sit amet, lacinia quis velit. Donec vestibulum orci et quam hendrerit fermentum. Sed ac posuere libero. Aenean imperdiet faucibus accumsan.
      </p>
    </React.Fragment>
  );
};

export default Index;