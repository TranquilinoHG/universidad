#include <stdio.h>
#include <opencv2/opencv.hpp>
int main(int argc, char** argv){
	int i, j;
	if(argc!=2){
		printf("Pasar una imagen como parametro");
		return -1;
	}
	cv::Mat A=cv::imread(argv[1]);
	printf("Columnas: %d, Filas: %d, Canales: %d\n", A.cols, A.rows, A.channels());
	cv::namedWindow("Imagen", cv::WINDOW_AUTOSIZE);
	for(j=0;j<A.rows;j++){
		uchar *renglon=A.ptr<uchar>(j);
		for(i=0;i<A.cols*3;i+=3){
			*(renglon+i+0)=0;
			//*(renglon+i+2)=0;
		}
	}

	cv::imshow("Imagen",A);
	int tecla;
	while(true){
		tecla=cv::waitKey(0);
		if(tecla==27) break;
	}
	return 0;

}